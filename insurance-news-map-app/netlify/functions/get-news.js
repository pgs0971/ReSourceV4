const Parser = require("rss-parser");
const cheerio = require("cheerio");
const NodeGeocoder = require("node-geocoder");
const nlp = require("compromise");

const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 InsuranceNewsIntelligenceBot",
  },
});

// Free provider (Nominatim). No API key.
const geocoder = NodeGeocoder({ provider: "openstreetmap" });

// Simple in-memory caches (reset on cold start)
let FEED_CACHE = { ts: 0, data: null };
const FEED_TTL_MS = 10 * 60 * 1000; // 10 minutes

const GEO_CACHE = new Map(); // location -> {lat,lng,location}
const GEO_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const GEO_TS = new Map(); // location -> ts

function safeDate(d) {
  const dt = new Date(d || Date.now());
  return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
}

function classify(text) {
  const t = (text || "").toLowerCase();

  const isMA = /(merger|acquisition|takeover|acquires|acquired|to acquire|buyout)/.test(t);
  const isLoss = /(major loss|large loss|catastrophe|wildfire|flood|hurricane|earthquake|typhoon|storm|explosion|fire|collapse|cyber)/.test(t);

  if (isMA && !isLoss) return "M&A";
  if (isLoss && !isMA) return "Major Loss";
  if (isMA && isLoss) return "Major Loss"; // tie-breaker (loss events often dominate mapping)
  return null;
}

function extractLocationFromText(text) {
  const doc = nlp(text || "");
  const places = doc.places().out("array");
  if (places && places.length) return places[0];

  // fallback: common patterns like "City, State" or "City, Country"
  const m = (text || "").match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2}),\s([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2})\b/);
  if (m) return `${m[1]}, ${m[2]}`;

  return null;
}

async function geocode(location) {
  if (!location) return null;

  const now = Date.now();
  const ts = GEO_TS.get(location) || 0;
  if (GEO_CACHE.has(location) && now - ts < GEO_TTL_MS) return GEO_CACHE.get(location);

  try {
    const res = await geocoder.geocode(location);
    if (!res || !res.length) return null;

    const g = {
      lat: res[0].latitude,
      lng: res[0].longitude,
      location,
    };

    if (Number.isFinite(g.lat) && Number.isFinite(g.lng)) {
      GEO_CACHE.set(location, g);
      GEO_TS.set(location, now);
      return g;
    }
    return null;
  } catch {
    return null;
  }
}

async function scrapeHaggiePressReleases() {
  // Page is HTML (not RSS). We scrape it.
  const url = "https://www.haggiepartners.com/press-releases/";
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 InsuranceNewsIntelligenceBot" } });
  if (!res.ok) return [];

  const html = await res.text();
  const $ = cheerio.load(html);

  // Try a few structures to be resilient across theme changes
  const links = [];
  $("a").each((_, a) => {
    const href = $(a).attr("href") || "";
    const text = $(a).text().trim();
    if (!href || !text) return;

    const isPress = href.includes("haggiepartners.com") && /press-release|press-releases/.test(href);
    const looksLikePR = /press release/i.test(text) || /acquires|acquisition|merger|catastrophe|loss|reinsurance|insurance/i.test(text);

    if (isPress && looksLikePR) {
      links.push({ title: text, link: href });
    }
  });

  // De-dupe by link
  const uniq = new Map();
  for (const l of links) uniq.set(l.link, l);
  const deduped = Array.from(uniq.values()).slice(0, 50);

  // Best effort: extract a date if present on listing
  // (If not, article page parsing would be needed; we keep this lightweight)
  return deduped.map((x, i) => ({
    id: `hp-${i}-${x.link}`,
    title: x.title,
    link: x.link,
    pubDate: new Date().toISOString(),
    contentSnippet: x.title,
    source: "Haggie Partners",
  }));
}

function mapFeedItems(items, prefix, source, forceCategory = null) {
  return (items || []).map((item, idx) => ({
    id: `${prefix}-${idx}-${item.link}`,
    title: item.title,
    link: item.link,
    pubDate: safeDate(item.pubDate || item.isoDate),
    contentSnippet: item.contentSnippet || item.content || "",
    source,
    forceCategory,
  }));
}

exports.handler = async function () {
  if (Date.now() - FEED_CACHE.ts < FEED_TTL_MS && FEED_CACHE.data) {
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=600" },
      body: JSON.stringify(FEED_CACHE.data),
    };
  }

  try {
    const lossRSS = "https://news.google.com/rss/search?q=insurance+reinsurance+(major+loss+OR+large+loss+OR+catastrophe+OR+hurricane+OR+wildfire+OR+flood+OR+cyber)&hl=en-GB&gl=GB&ceid=GB:en";
    const maRSS = "https://news.google.com/rss/search?q=insurance+reinsurance+(merger+OR+acquisition+OR+takeover+OR+buyout)&hl=en-GB&gl=GB&ceid=GB:en";

    const [lossFeed, maFeed, haggiePR] = await Promise.all([
      parser.parseURL(lossRSS),
      parser.parseURL(maRSS),
      scrapeHaggiePressReleases(),
    ]);

    const raw = [
      ...mapFeedItems(lossFeed.items, "gnl", "Google News", "Major Loss"),
      ...mapFeedItems(maFeed.items, "gnm", "Google News", "M&A"),
      ...haggiePR,
    ]
      .filter((a) => a.title && a.link)
      .slice(0, 400);

    const enriched = [];
    for (const a of raw) {
      const text = `${a.title} ${a.contentSnippet || ""}`;
      const category = a.forceCategory || classify(text);
      if (!category) continue;

      // Location extraction + geocode
      const loc = extractLocationFromText(text);
      const geo = await geocode(loc);
      if (!geo) continue;

      enriched.push({
        id: a.id,
        title: a.title,
        link: a.link,
        date: a.pubDate,
        category,
        source: a.source,
        location: geo.location,
        lat: geo.lat,
        lng: geo.lng,
      });
    }

    // Sort & cap
    const finalData = enriched
      .sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime())
      .slice(0, 200);

    FEED_CACHE = { ts: Date.now(), data: finalData };

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=600" },
      body: JSON.stringify(finalData),
    };
  } catch (err) {
    console.error("get-news error:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to fetch news feeds" }),
    };
  }
};
