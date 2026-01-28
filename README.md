# @rzavadzich/innowise-ts-math-utils

TypeScript math utilities with automated CI/CD pipeline.

## Installation

```bash
npm install @rzavadzich/innowise-ts-math-utils
```

## Usage

```typescript
import { sum } from '@rzavadzich/innowise-ts-math-utils';
sum(2, 3); // 5
```

```javascript
const { sum } = require('@rzavadzich/innowise-ts-math-utils');
sum(2, 3); // 5
```

## CI/CD Pipeline

### PR Checks (automatic)

- Version bump verification (must differ from main)
- Lockfile validation (`npm ci --frozen-lockfile`)
- Branch ancestry check (must be up-to-date with main)
- Linting, build, and unit tests

### Label-Driven Workflows

| Label | Action |
|-------|--------|
| `verify` | Runs E2E tests (pack, install, verify ESM/CJS imports) |
| `publish` | Publishes RC version (`X.Y.Z-dev-<sha>`) to GitHub Packages |

### Release (on merge with `publish` label)

1. Publishes package with `latest` tag
2. Creates Git tag (`vX.Y.Z`)
3. Creates GitHub Release with auto-generated notes

## Version Bumping

All PRs require a version bump:

```bash
npm version patch  # bug fixes (0.0.x)
npm version minor  # new features (0.x.0)
npm version major  # breaking changes (x.0.0)
```

## Branch Protection

- Requires PR with passing checks: `version-check`, `validate`, `ci/*`
- Requires branch to be up-to-date with main (linear history)
- Enforced for administrators
