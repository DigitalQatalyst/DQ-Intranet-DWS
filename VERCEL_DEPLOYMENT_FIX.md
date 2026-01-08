# Vercel Deployment Fix Guide

## 🔍 Root Cause Analysis

**Primary Issue**: Branch name case mismatch + Vercel branch configuration
- Local: `feature/authentication` (lowercase)
- Remote: `origin/Feature/Authentication` (capital F and A)
- Latest commit: `d975d6f7aa7631f9aca447c7331ddf86dde26ae4`

**Why Vercel is showing old UI**:
1. Vercel may be tracking `main` branch instead of feature branch
2. Preview deployment might be cached or pointing to wrong commit
3. Branch name case sensitivity causing tracking mismatch

---

## ✅ Step-by-Step Fix

### Step 1: Verify Vercel Branch Configuration

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Git**
2. Check **Production Branch**: Should be `main` (correct)
3. Check **Preview Branch Settings**: 
   - Ensure `Feature/Authentication` or `feature/authentication` is allowed
   - If using wildcard: `feature/*` should cover it

### Step 2: Force Redeploy from Correct Branch

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to **Deployments** tab
2. Find the deployment for `Feature/Authentication` branch
3. Click **⋯** (three dots) → **Redeploy**
4. Select **Use existing Build Cache: No** (to force fresh build)
5. Click **Redeploy**

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Force redeploy from current branch
vercel --prod=false --force
```

### Step 3: Verify Branch Name Consistency

**Fix the case mismatch** (choose one approach):

**Approach 1: Rename remote branch to match local (Recommended)**
```bash
# Push current branch with correct case
git push origin feature/authentication:feature/authentication --force

# Delete old remote branch
git push origin --delete Feature/Authentication

# Update local tracking
git branch --set-upstream-to=origin/feature/authentication feature/authentication
```

**Approach 2: Update local to match remote**
```bash
# Rename local branch
git branch -m feature/authentication Feature/Authentication

# Push to match remote
git push origin Feature/Authentication
```

### Step 4: Clear Vercel Build Cache

1. Go to **Vercel Dashboard** → **Deployments**
2. Find latest deployment for your feature branch
3. Click **⋯** → **Redeploy**
4. **Uncheck** "Use existing Build Cache"
5. Click **Redeploy**

### Step 5: Verify Deployment SHA

After redeploy, check:
1. **Vercel Dashboard** → **Deployments** → Latest deployment
2. Click on the deployment
3. Check **Commit SHA** in deployment details
4. Should match: `d975d6f7aa7631f9aca447c7331ddf86dde26ae4`

---

## 🚀 One-Command Fallback Fix

If all else fails, use this to force a fresh deployment:

```bash
# Make a trivial commit to trigger new deployment
git commit --allow-empty -m "chore: trigger Vercel redeploy [skip ci]"
git push origin Feature/Authentication
```

Then in Vercel Dashboard:
1. Go to **Deployments**
2. Find the new deployment
3. Click **⋯** → **Redeploy** → **Use existing Build Cache: No**

---

## 📋 Best Practices Going Forward

### Feature Branches
1. **Use consistent naming**: Stick to `feature/description` (lowercase) convention
2. **Preview deployments**: Vercel auto-deploys all branches by default
3. **Branch protection**: Use Vercel's branch protection rules for production

### Preview Deployments
1. **Auto-deploy**: Enable for all branches in Settings → Git → Preview Branch Settings
2. **Build cache**: Disable cache when debugging deployment issues
3. **Deployment URLs**: Each branch gets unique preview URL

### Production Deployments
1. **Production branch**: Set to `main` in Settings → Git
2. **Auto-deploy**: Enable automatic deployments from production branch
3. **Manual deploy**: Use "Promote to Production" for feature branch previews

### Preventing This Issue
1. **Branch naming convention**: Document and enforce consistent naming
2. **Pre-commit hooks**: Use Git hooks to enforce branch naming
3. **Vercel webhooks**: Monitor deployment status via webhooks
4. **CI/CD checks**: Add checks to verify deployment SHA matches commit SHA

---

## 🔧 Why This Happens

### Vercel Preview Deployments
- Vercel creates preview deployments for each branch push
- If branch name changes (case), Vercel treats it as a new branch
- Old preview URL might still point to cached/stale deployment

### Forced-Update Repos
- Multiple feature branches can cause deployment queue issues
- Vercel may prioritize main branch over feature branches
- Build cache can persist across deployments if not cleared

### Case Sensitivity
- Git on macOS/Windows is case-insensitive by default
- Vercel's Git integration is case-sensitive
- Branch name changes (even case) create new tracking entries

---

## 🎯 Verification Checklist

After applying fixes, verify:

- [ ] Vercel deployment SHA matches latest commit SHA (`d975d6f`)
- [ ] Preview URL shows new UI (not cached version)
- [ ] Branch name is consistent (local = remote)
- [ ] Build logs show fresh build (not cached)
- [ ] Deployment status is "Ready" (not "Building" or "Error")

---

## 📞 Quick Reference

**Current State**:
- Branch: `feature/authentication` (local) / `Feature/Authentication` (remote)
- Latest Commit: `d975d6f7aa7631f9aca447c7331ddf86dde26ae4`
- Vercel Project: DQ-Intranet-DWS
- Repository: `DigitalQatalyst/DQ-Intranet-DWS-`

**Commands to Run**:
```bash
# Check current state
git log -1 --oneline
git rev-parse HEAD

# Force redeploy (after fixing branch name)
git push origin Feature/Authentication --force

# Or use Vercel CLI
vercel --prod=false --force
```

