#!/bin/bash
set -e

REPO_FULL_NAME=$(gh repo view --json nameWithOwner -q .nameWithOwner)
OWNER=$(echo $REPO_FULL_NAME | cut -d/ -f1)
REPO=$(echo $REPO_FULL_NAME | cut -d/ -f2)

echo "Configuring branch protection for $REPO_FULL_NAME..."

# 21.1 Implement branch protection API configuration
# 23. Enhance repository setup script with linear history and up-to-date branch requirements
cat <<JSON | gh api repos/$OWNER/$REPO/branches/main/protection --method PUT --input -
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "PR Checks / validate (pull_request)",
      "PR Checks / ci / lint (pull_request)",
      "PR Checks / ci / build (pull_request)",
      "PR Checks / ci / test (pull_request)"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
JSON

# 21.2 Implement labels
echo "Creating labels..."
gh label create verify --color "006b96" --description "Run E2E tests" --force || true
gh label create publish --color "0e8a16" --description "Prepare release candidate" --force || true

echo "Setup complete!"
