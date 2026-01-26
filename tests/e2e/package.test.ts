import { test, expect, afterAll } from 'vitest';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const projectRoot = path.resolve(__dirname, '../../');
let tempDir: string;
let packName: string;

test('package packs and installs correctly', async () => {
  // 1. Build project
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });

  // 2. npm pack
  const stdout = execSync('npm pack', { cwd: projectRoot, encoding: 'utf-8' });
  packName = stdout.trim().split('\n').pop()!.trim(); // Handle potential logs in stdout
  const packPath = path.join(projectRoot, packName);

  console.log(`Packed: ${packPath}`);
  expect(fs.existsSync(packPath)).toBe(true);

  // 3. Create temp consumer project
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'math-utils-e2e-'));
  console.log(`Temp dir: ${tempDir}`);

  // Initialize package.json in temp dir
  fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify({
      name: 'test-consumer',
      type: 'module',
      dependencies: {},
    })
  );

  // 4. Install packed tarball
  console.log('Installing tarball...');
  execSync(`npm install ${packPath}`, { cwd: tempDir, stdio: 'inherit' });

  // 5. Test ESM import
  console.log('Testing ESM...');
  const esmScript = `
    import { sum } from '@rzavadzich/innowise-ts-math-utils';
    if (sum(1, 2) !== 3) {
        console.error('ESM sum failed');
        process.exit(1);
    }
    console.log('ESM OK');
  `;
  fs.writeFileSync(path.join(tempDir, 'test.mjs'), esmScript);
  execSync('node test.mjs', { cwd: tempDir, stdio: 'inherit' });

  // 6. Test CJS require
  console.log('Testing CJS...');
  const cjsScript = `
    const { sum } = require('@rzavadzich/innowise-ts-math-utils');
    if (sum(1, 2) !== 3) {
         console.error('CJS sum failed');
         process.exit(1);
    }
    console.log('CJS OK');
  `;
  fs.writeFileSync(path.join(tempDir, 'test.cjs'), cjsScript);
  execSync('node test.cjs', { cwd: tempDir, stdio: 'inherit' });

  // Cleanup tarball
  fs.unlinkSync(packPath);
});

// Cleanup temp dir
afterAll(() => {
  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
