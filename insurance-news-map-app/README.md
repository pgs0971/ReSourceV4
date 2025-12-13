# Insurance News Intelligence Map (Vite + React + Netlify)

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Netlify

- Push this folder to GitHub as repo root
- In Netlify: New site from Git
- Build command: `npm run build`
- Publish directory: `dist`

The function is available at:
- `/api/get-news`

## Notes
- Uses Google News RSS + Haggie Partners Press Releases listing.
- Geocoding uses OpenStreetMap via node-geocoder (no API key).
- Results cached for 10 minutes.

If you see a map but no pins, it means the current feed items did not yield a reliable place name for geocoding.
You can improve accuracy by adding more sources or expanding location extraction.
