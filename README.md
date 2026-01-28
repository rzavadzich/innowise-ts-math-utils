# @rzavadzich/innowise-ts-math-utils

A TypeScript math utilities library with a fully automated CI/CD pipeline.

## Overview of this project

This package provides type-safe mathematical utility functions for TypeScript/JavaScript projects. It serves as a reference implementation demonstrating modern CI/CD practices with GitHub Actions, including dual ESM/CJS builds and label-driven releases.

## Installation

```bash
npm install @rzavadzich/innowise-ts-math-utils
```

## Usage

### ESM

```typescript
import { sum } from '@rzavadzich/innowise-ts-math-utils';

const result = sum(2, 3); // 5
```

### CommonJS

```javascript
const { sum } = require('@rzavadzich/innowise-ts-math-utils');

const result = sum(2, 3); // 5
```

## CI/CD Pipeline

### PR Checks Workflow

Every pull request automatically triggers the `PR Checks` workflow (`pr-checks.yml`) which:

- **Version Check**: Verifies the `package.json` version has been explicitly bumped compared to the `main` branch.
- **Validation**: Validates `package-lock.json` integrity (`npm ci --frozen-lockfile`) and branch ancestry.
- **CI**: Runs ESLint, builds the project, and executes unit tests (via reusable workflows).

### Label-Driven Workflows

#### `verify` Label

Adding the `verify` label to a PR triggers the `Verify Label` workflow (`label-verify.yml`) for comprehensive E2E testing:

- Packs the package as a tarball.
- Installs it in an isolated temporary environment.
- Verifies that both ESM and CJS imports work correctly.
- Confirms TypeScript declarations are correctly included and usable.

#### `publish` Label

Adding the `publish` label triggers the `Publish Label` workflow (`label-publish.yml`):

- Generates a Release Candidate (RC) version by appending `-dev-<short-sha>` (e.g., `1.0.1-dev-a1b2c3d`).
- Publishes the RC build to the GitHub Packages registry with the `rc` tag.
- This allows for manual verification of the build before merging.

### Release Process

The `Release` workflow (`release.yml`) is triggered when a PR is merged into `main`, provided it has the `publish` label:

1. Validates that the `publish` label is present.
2. Publishes the package to the npm registry with the `latest` tag.
3. Automatically creates a Git tag (e.g., `v1.0.1`).
4. Generates a GitHub Release with auto-generated release notes.

## Version Bumping

**All PRs must include a version bump.** The CI will fail if the `package.json` version matches the `main` branch.

Use semantic versioning commands to bump the version:

```bash
npm version patch  # for bug fixes (0.0.x)
npm version minor  # for new features (0.x.0)
npm version major  # for breaking changes (x.0.0)
```

## Branch Protection

The `main` branch is protected with the following rules:

- **Require a pull request before merging**: No direct pushes allowed.
- **Require status checks to pass**: `version-check`, `validate`, and `ci` jobs must succeed.
- **Require branches to be up to date before merging**: Ensures linear history and compatibility.
- **Enforce admins**: Rules apply to administrators as well.
- **Restrict deletions**: Prevents accidental deletion of the `main` branch.
