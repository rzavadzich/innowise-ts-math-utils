import { test, expect, afterAll } from 'vitest';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const projectRoot = path.resolve(__dirname, '../../');
let tempDir: string;

test('package packs and installs correctly', async () => {
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });

  const stdout = execSync('npm pack', { cwd: projectRoot, encoding: 'utf-8' });
  const packName = stdout.trim().split('\n').pop()!.trim();
  const packPath = path.join(projectRoot, packName);

  expect(fs.existsSync(packPath)).toBe(true);

  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'math-utils-e2e-'));

  fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify({ name: 'test-consumer', type: 'module', dependencies: {} })
  );

  execSync(`npm install ${packPath}`, { cwd: tempDir, stdio: 'inherit' });

  const esmScript = `
import { sum } from '@rzavadzich/innowise-ts-math-utils';
if (sum(1, 2) !== 3) process.exit(1);
`;
  fs.writeFileSync(path.join(tempDir, 'test.mjs'), esmScript);
  execSync('node test.mjs', { cwd: tempDir, stdio: 'inherit' });

  const cjsScript = `
const { sum } = require('@rzavadzich/innowise-ts-math-utils');
if (sum(1, 2) !== 3) process.exit(1);
`;
  fs.writeFileSync(path.join(tempDir, 'test.cjs'), cjsScript);
  execSync('node test.cjs', { cwd: tempDir, stdio: 'inherit' });

  fs.unlinkSync(packPath);
}, 600000);

afterAll(() => {
  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
