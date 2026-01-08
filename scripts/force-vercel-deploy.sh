#!/bin/bash

# Force Vercel Deployment Script
# This script forces a fresh Vercel deployment with cache disabled

set -e

echo "🚀 Forcing Vercel Deployment"
echo "============================="
echo ""

# Get current branch and commit
BRANCH=$(git branch --show-current)
COMMIT_SHA=$(git rev-parse --short HEAD)
FULL_SHA=$(git rev-parse HEAD)

echo "📍 Branch: $BRANCH"
echo "📝 Commit: $COMMIT_SHA ($FULL_SHA)"
echo ""

# Check if we're on the right branch
if [[ "$BRANCH" != *"authentication"* ]] && [[ "$BRANCH" != *"Authentication"* ]]; then
    echo "⚠️  Warning: Current branch doesn't contain 'authentication'"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📤 Pushing latest commit to trigger deployment..."
git push origin HEAD:Feature/Authentication || {
    echo "❌ Failed to push. Trying alternative method..."
    git push origin HEAD:feature/authentication || {
        echo "❌ Push failed. Please check your git status."
        exit 1
    }
}

echo ""
echo "✅ Code pushed successfully!"
echo ""
echo "🔧 Next Steps (choose one):"
echo ""
echo "Option 1: Use Vercel Dashboard (Recommended)"
echo "   1. Go to: https://vercel.com/dashboard"
echo "   2. Select your project: DQ-Intranet-DWS"
echo "   3. Go to 'Deployments' tab"
echo "   4. Find deployment for branch: Feature/Authentication"
echo "   5. Click '⋯' (three dots) → 'Redeploy'"
echo "   6. IMPORTANT: Uncheck 'Use existing Build Cache'"
echo "   7. Click 'Redeploy'"
echo ""
echo "Option 2: Use Vercel CLI (if authenticated)"
echo "   Run: npx vercel --prod=false --force"
echo ""
echo "📋 Deployment Details:"
echo "   Branch: Feature/Authentication"
echo "   Commit SHA: $COMMIT_SHA"
echo "   Full SHA: $FULL_SHA"
echo ""
echo "💡 If deployment still shows old UI:"
echo "   1. Check deployment SHA matches: $COMMIT_SHA"
echo "   2. Clear browser cache (hard refresh: Cmd+Shift+R)"
echo "   3. Try incognito/private window"
echo "   4. Check Vercel build logs for errors"

