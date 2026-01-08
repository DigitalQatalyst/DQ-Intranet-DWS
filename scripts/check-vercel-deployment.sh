#!/bin/bash

# Vercel Deployment Diagnostic Script
# Checks Git state vs expected Vercel deployment state

set -e

echo "🔍 Vercel Deployment Diagnostic"
echo "================================"
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current Branch: $CURRENT_BRANCH"

# Get latest commit SHA
LATEST_SHA=$(git rev-parse HEAD)
SHORT_SHA=$(git rev-parse --short HEAD)
echo "📝 Latest Commit SHA: $LATEST_SHA ($SHORT_SHA)"

# Get commit message
COMMIT_MSG=$(git log -1 --pretty=%B)
echo "💬 Commit Message: $COMMIT_MSG"
echo ""

# Check remote branches
echo "🌐 Remote Branches:"
git branch -r | grep -i authentication || echo "  (no authentication branch found on remote)"
echo ""

# Check if branch is pushed
if git rev-parse --verify origin/$CURRENT_BRANCH >/dev/null 2>&1; then
    REMOTE_SHA=$(git rev-parse origin/$CURRENT_BRANCH)
    echo "✅ Branch is pushed to remote"
    echo "   Remote SHA: $REMOTE_SHA"
    
    if [ "$LATEST_SHA" = "$REMOTE_SHA" ]; then
        echo "   ✅ Local and remote are in sync"
    else
        echo "   ⚠️  Local and remote are OUT OF SYNC"
        echo "   Run: git push origin $CURRENT_BRANCH"
    fi
else
    echo "⚠️  Branch is NOT pushed to remote"
    echo "   Run: git push origin $CURRENT_BRANCH"
fi
echo ""

# Check for case mismatch
REMOTE_BRANCHES=$(git branch -r | grep -i authentication | sed 's|origin/||' | tr '\n' ' ')
if [ -n "$REMOTE_BRANCHES" ]; then
    echo "🔤 Branch Name Check:"
    for BRANCH in $REMOTE_BRANCHES; do
        if [ "$BRANCH" != "$CURRENT_BRANCH" ]; then
            echo "   ⚠️  Case mismatch detected!"
            echo "      Local:  $CURRENT_BRANCH"
            echo "      Remote: $BRANCH"
        else
            echo "   ✅ Branch names match"
        fi
    done
fi
echo ""

# Vercel CLI check
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI is installed"
    echo "   Run: vercel --prod=false --force"
else
    echo "⚠️  Vercel CLI not installed"
    echo "   Install: npm i -g vercel"
fi
echo ""

# Summary
echo "📋 Summary:"
echo "   Branch: $CURRENT_BRANCH"
echo "   SHA: $SHORT_SHA"
echo ""
echo "🎯 Next Steps:"
echo "   1. Verify Vercel Dashboard shows deployment for branch: $CURRENT_BRANCH"
echo "   2. Check deployment SHA matches: $SHORT_SHA"
echo "   3. If mismatch, redeploy with cache disabled"
echo "   4. Or run: git commit --allow-empty -m 'chore: trigger redeploy' && git push"

