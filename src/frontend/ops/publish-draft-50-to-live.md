# Publish Draft Version 50 to Live - Runbook

## Overview
This runbook describes the steps to promote Draft Version 50 to the live/production version of the fitness tracker dapp.

## Prerequisites
- Draft Version 50 must be successfully deployed and tested
- Access to the deployment platform/infrastructure
- Backup of current live version (if applicable)

## Promotion Steps

### 1. Verify Draft Version 50
Before promoting to live, verify that Draft Version 50:
- ✅ Loads correctly in the draft environment
- ✅ All features work as expected (authentication, profile setup, dashboard, tracking, etc.)
- ✅ No console errors or critical warnings
- ✅ Favicon and assets load properly
- ✅ Backend integration is functioning

### 2. Promote to Live
The exact steps depend on your deployment platform:

#### Option A: Caffeine.ai Platform
If using Caffeine's deployment system:
1. Navigate to the Caffeine.ai dashboard
2. Go to Deployments → Draft Versions
3. Locate Draft Version 50
4. Click "Promote to Live" or "Publish" button
5. Confirm the promotion action

#### Option B: Manual Deployment
If manually deploying:
1. Build the production bundle from Draft Version 50 source
2. Deploy the built assets to your production hosting
3. Update DNS/routing to point to the new deployment
4. Clear CDN cache if applicable

#### Option C: Internet Computer Canister
If deploying to IC:
1. Ensure Draft Version 50 frontend assets are built
2. Deploy to the production frontend canister:
   ```bash
   dfx deploy frontend --network ic
   ```
3. Verify the canister ID matches your production frontend

### 3. Post-Deployment Verification
After promotion, verify the live site:
- ✅ Visit the live URL and confirm it loads Draft Version 50
- ✅ Test critical user flows (login, profile setup, tracking)
- ✅ Check that no other draft version (e.g., Draft 15) was accidentally promoted
- ✅ Verify favicon appears correctly in browser tabs
- ✅ Test on multiple browsers/devices

### 4. Rollback Plan
If issues are discovered after promotion:
1. Identify the previous stable version
2. Follow the same promotion steps to revert
3. Investigate issues in Draft Version 50 before re-attempting

## Verification Checklist
- [ ] Draft Version 50 verified in draft environment
- [ ] Promotion action completed successfully
- [ ] Live URL loads Draft Version 50 (not Draft 15 or other versions)
- [ ] Critical features tested on live
- [ ] No console errors on live
- [ ] Favicon displays correctly
- [ ] Team notified of successful deployment

## Notes
- This is a **frontend-only** promotion - no backend code changes are included
- Draft Version 50 includes the pink heart favicon on white circle background
- Ensure only Draft Version 50 is promoted, not any other draft version

## Troubleshooting
- **Issue**: Wrong version appears live
  - **Solution**: Verify the correct build artifacts were deployed; check cache
  
- **Issue**: Favicon not showing
  - **Solution**: Clear browser cache; verify favicon files are in `/assets/generated/`
  
- **Issue**: Authentication fails
  - **Solution**: Verify backend canister IDs are correct in production config

## Contact
For deployment issues, contact your platform administrator or Caffeine.ai support.
