# 1. Kill the server (if it's still attempting to run)
# 2. Delete the cache and modules folders
rm -rf .next node_modules package-lock.json 
# 3. Clean npm cache (optional, but good for thoroughness)
npm cache clean --force
# 4. Reinstall dependencies
npm install
# 5. Try running again
npm run dev
