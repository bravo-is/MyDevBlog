# Bookshelf Data Management

This project fetches book data from the Hardcover API. To ensure builds don't fail when the API is unreachable, we use a local cache mechanism.

## How It Works

1. **Local Cache**: The file `src/lib/bookshelf.cache.json` stores your bookshelf data
2. **Fallback Logic**: If the API fails during build, the cache is used automatically
3. **Cache Updates**: Run `npm run update:bookshelf` to manually refresh the cache from the API

## Workflow

### For Local Development
```bash
npm run dev
# The API is called on every build, fresh data each time
```

### Before Deploying to Netlify
```bash
# 1. Update the cache from your local environment
npm run update:bookshelf

# 2. Commit the updated cache
git add src/lib/bookshelf.cache.json
git commit -m "Update bookshelf cache"

# 3. Push to trigger Netlify build
git push
```

### Netlify Build Process
The `netlify.toml` automatically runs:
1. `npm run update:bookshelf` - Attempts to fetch fresh data from Hardcover API
2. `npm run build` - Builds your site
   - If step 1 succeeds: Uses fresh data
   - If step 1 fails: Falls back to cached data automatically
   - **Build never fails** due to API issues ✅

## Requirements

- **HARDCOVER_API_TOKEN**: Add this as a secret environment variable in Netlify Dashboard
  - Site Settings → Build & deploy → Environment
  - Add key: `HARDCOVER_API_TOKEN`
  - Add your token value

## Troubleshooting

### Cache is outdated
Run locally and push:
```bash
npm run update:bookshelf
git add src/lib/bookshelf.cache.json
git commit -m "Update bookshelf"
git push
```

### Netlify build fails
- Check Netlify deploy logs for exact error
- Verify `HARDCOVER_API_TOKEN` is set in Netlify environment variables
- The build should still succeed with cached data unless there's another build error

### Want to see the cache being used
Check your site's bookshelf page - if using cached data, you'll see a subtle message like "Using cached data (API error)."
