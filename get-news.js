const Parser = require("rss-parser");

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
  },
  customFields: {
    item: ['description', 'content:encoded', 'content'],
  },
});

// Comprehensive Coordinate Database for Global Geotagging
const LOCATIONS = {
  // --- Major Insurance Hubs & Financial Centers ---
  "london": { lat: 51.5074, lng: -0.1278 },
  "bermuda": { lat: 32.3078, lng: -64.7505 },
  "hamilton": { lat: 32.2903, lng: -64.7703 }, // Bermuda capital
  "zurich": { lat: 47.3769, lng: 8.5417 },
  "munich": { lat: 48.1351, lng: 11.5820 },
  "hannover": { lat: 52.3759, lng: 9.7320 },
  "new york": { lat: 40.7128, lng: -74.0060 },
  "nyc": { lat: 40.7128, lng: -74.0060 },
  "singapore": { lat: 1.3521, lng: 103.8198 },
  "hong kong": { lat: 22.3193, lng: 114.1694 },
  "tokyo": { lat: 35.6762, lng: 139.6503 },
  "dubai": { lat: 25.2048, lng: 55.2708 },
  "lloyd's": { lat: 51.5130, lng: -0.0822 },

  // --- North America ---
  "usa": { lat: 37.0902, lng: -95.7129 },
  "us": { lat: 37.0902, lng: -95.7129 },
  "united states": { lat: 37.0902, lng: -95.7129 },
  "canada": { lat: 56.1304, lng: -106.3468 },
  "toronto": { lat: 43.6532, lng: -79.3832 },
  "vancouver": { lat: 49.2827, lng: -123.1207 },
  "calgary": { lat: 51.0447, lng: -114.0719 },
  "montreal": { lat: 45.5017, lng: -73.5673 },
  "mexico": { lat: 23.6345, lng: -102.5528 },
  "mexico city": { lat: 19.4326, lng: -99.1332 },
  
  // US States & Major Cities (High frequency in loss reports)
  "florida": { lat: 27.6648, lng: -81.5158 },
  "miami": { lat: 25.7617, lng: -80.1918 },
  "california": { lat: 36.7783, lng: -119.4179 },
  "san francisco": { lat: 37.7749, lng: -122.4194 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "texas": { lat: 31.9686, lng: -99.9018 },
  "houston": { lat: 29.7604, lng: -95.3698 },
  "louisiana": { lat: 30.9843, lng: -91.9623 },
  "new orleans": { lat: 29.9511, lng: -90.0715 },
  "chicago": { lat: 41.8781, lng: -87.6298 },
  "illinois": { lat: 40.6331, lng: -89.3985 },
  "atlanta": { lat: 33.7490, lng: -84.3880 },
  "georgia": { lat: 32.1656, lng: -82.9001 },
  "carolinas": { lat: 35.7596, lng: -79.0193 }, // Rough center of NC/SC
  "north carolina": { lat: 35.7596, lng: -79.0193 },
  "south carolina": { lat: 33.8361, lng: -81.1637 },
  "hawaii": { lat: 19.8968, lng: -155.5828 },
  "maui": { lat: 20.7984, lng: -156.3319 },

  // --- Europe ---
  "uk": { lat: 54.5, lng: -4.0 },
  "united kingdom": { lat: 54.5, lng: -4.0 },
  "britain": { lat: 54.5, lng: -4.0 },
  "ireland": { lat: 53.1424, lng: -7.6921 },
  "dublin": { lat: 53.3498, lng: -6.2603 },
  "france": { lat: 46.2276, lng: 2.2137 },
  "paris": { lat: 48.8566, lng: 2.3522 },
  "germany": { lat: 51.1657, lng: 10.4515 },
  "italy": { lat: 41.8719, lng: 12.5674 },
  "rome": { lat: 41.9028, lng: 12.4964 },
  "milan": { lat: 45.4642, lng: 9.1900 },
  "spain": { lat: 40.4637, lng: -3.7492 },
  "madrid": { lat: 40.4168, lng: -3.7038 },
  "switzerland": { lat: 46.8182, lng: 8.2275 },
  "basel": { lat: 47.5596, lng: 7.5886 },
  "geneva": { lat: 46.2044, lng: 6.1432 },
  "netherlands": { lat: 52.1326, lng: 5.2913 },
  "amsterdam": { lat: 52.3676, lng: 4.9041 },
  "belgium": { lat: 50.5039, lng: 4.4699 },
  "brussels": { lat: 50.8503, lng: 4.3517 },
  "poland": { lat: 51.9194, lng: 19.1451 },
  "warsaw": { lat: 52.2297, lng: 21.0122 },
  "ukraine": { lat: 48.3794, lng: 31.1656 },
  "turkey": { lat: 38.9637, lng: 35.2433 },
  "türkiye": { lat: 38.9637, lng: 35.2433 },
  "greece": { lat: 39.0742, lng: 21.8243 },

  // --- Asia Pacific ---
  "china": { lat: 35.8617, lng: 104.1954 },
  "beijing": { lat: 39.9042, lng: 116.4074 },
  "shanghai": { lat: 31.2304, lng: 121.4737 },
  "japan": { lat: 36.2048, lng: 138.2529 },
  "india": { lat: 20.5937, lng: 78.9629 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "delhi": { lat: 28.6139, lng: 77.2090 },
  "australia": { lat: -25.2744, lng: 133.7751 },
  "sydney": { lat: -33.8688, lng: 151.2093 },
  "melbourne": { lat: -37.8136, lng: 144.9631 },
  "brisbane": { lat: -27.4698, lng: 153.0251 },
  "new zealand": { lat: -40.9006, lng: 174.8860 },
  "auckland": { lat: -36.8485, lng: 174.7633 },
  "korea": { lat: 35.9078, lng: 127.7669 },
  "seoul": { lat: 37.5665, lng: 126.9780 },
  "vietnam": { lat: 14.0583, lng: 108.2772 },
  "thailand": { lat: 15.8700, lng: 100.9925 },
  "bangkok": { lat: 13.7563, lng: 100.5018 },
  "indonesia": { lat: -0.7893, lng: 113.9213 },
  "jakarta": { lat: -6.2088, lng: 106.8456 },
  "philippines": { lat: 12.8797, lng: 121.7740 },
  "manila": { lat: 14.5995, lng: 120.9842 },
  "taiwan": { lat: 23.6978, lng: 120.9605 },

  // --- Middle East & Africa ---
  "uae": { lat: 23.4241, lng: 53.8478 },
  "saudi arabia": { lat: 23.8859, lng: 45.0792 },
  "israel": { lat: 31.0461, lng: 34.8516 },
  "south africa": { lat: -30.5595, lng: 22.9375 },
  "johannesburg": { lat: -26.2041, lng: 28.0473 },
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "morocco": { lat: 31.7917, lng: -7.0926 },

  // --- Latin America & Caribbean ---
  "brazil": { lat: -14.2350, lng: -51.9253 },
  "sao paulo": { lat: -23.5505, lng: -46.6333 },
  "rio": { lat: -22.9068, lng: -43.1729 },
  "chile": { lat: -35.6751, lng: -71.5430 },
  "argentina": { lat: -38.4161, lng: -63.6167 },
  "colombia": { lat: 4.5709, lng: -74.2973 },
  "caribbean": { lat: 15.3275, lng: -61.3726 },
  "jamaica": { lat: 18.1096, lng: -77.2975 },
  "bahamas": { lat: 25.0343, lng: -77.3963 },
  "puerto rico": { lat: 18.2208, lng: -66.5901 }
};

const findLocation = (text) => {
  if (!text) return null;
  const lowerText = text.toLowerCase();
  
  // Sort keys by length descending to match "New York" before "York"
  const keys = Object.keys(LOCATIONS).sort((a, b) => b.length - a.length);

  for (const key of keys) {
    // Regex ensures we match whole words (e.g. avoid matching "us" in "status")
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(lowerText)) {
      return { name: key.charAt(0).toUpperCase() + key.slice(1), ...LOCATIONS[key] };
    }
  }
  return null;
};

// Clean HTML tags from summary
const cleanSummary = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, '').substring(0, 200) + (html.length > 200 ? "..." : "");
};

exports.handler = async function (event) {
  const { query = "", type = "" } = event.queryStringParameters || {};

  let articles = [];

  const classify = (title = "", content = "") => {
    const text = (title + " " + content).toLowerCase();
    
    // M&A Keywords
    if (/\b(merger|acquisition|takeover|agrees|buy|sold|buying|stake|m&a|consolidate|combine|purchase|acquired|partner)\b/.test(text)) {
      return "Mergers & Acquisitions";
    }
    // Major Loss Keywords
    if (
      /\b(loss|catastrophe|hurricane|wildfire|flood|cyber|earthquake|typhoon|storm|disaster|claims|insured loss|nat cat|damage|peril|tornado|hail|outage|impact)\b/.test(
        text
      )
    ) {
      return "Major Loss";
    }
    // Fallback based on specific sources if needed, otherwise General
    return "General";
  };

  try {
    const feeds = [
      { url: "https://haggie.co.uk/feed/", source: "Haggie Partners" }, // Specific Request
      { url: "https://www.reinsurancene.ws/feed/", source: "Reinsurance News" },
      { url: "https://www.artemis.bm/feed/", source: "Artemis" },
      { url: "https://www.insurancejournal.com/rss/news/international/", source: "Insurance Journal (Intl)" },
      { url: "https://www.insurancejournal.com/rss/news/national/", source: "Insurance Journal (US)" },
      { url: "https://www.insurancebusinessmag.com/us/rss/", source: "Insurance Business" },
      { url: "https://www.canadianunderwriter.ca/feed/", source: "Canadian Underwriter" },
      { url: "https://www.insurancetimes.co.uk/rss/news", source: "Insurance Times" },
      { url: "https://www.insuranceinsider.com/rss/content/source/all", source: "Insurance Insider" }
    ];

    const feedPromises = feeds.map(async (feed) => {
      try {
        const feedResult = await parser.parseURL(feed.url);
        return feedResult.items.map((item) => {
            const rawContent = item.contentSnippet || item.content || item['content:encoded'] || "";
            const summary = cleanSummary(rawContent);
            const combinedText = (item.title + " " + summary).toLowerCase();
            const location = findLocation(item.title) || findLocation(summary);
            
            return {
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              content: summary,
              source: feed.source,
              category: classify(item.title, summary),
              location: location
            };
        });
      } catch (err) {
        console.error(`Error fetching ${feed.source}:`, err.message);
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    articles = results.flat();

    // Deduplicate based on title similarity
    const uniqueArticles = [];
    const seenTitles = new Set();
    
    articles.forEach(article => {
        const normalizedTitle = article.title.toLowerCase().trim().substring(0, 60); 
        if (!seenTitles.has(normalizedTitle)) {
            seenTitles.add(normalizedTitle);
            uniqueArticles.push({
                ...article,
                id: Math.random().toString(36).substr(2, 9)
            });
        }
    });
    
    articles = uniqueArticles;

    // Client Filters (Redundant but good for safety)
    if (type) {
      articles = articles.filter((a) => a.category === type);
    }
    if (query) {
       const q = query.toLowerCase();
       articles = articles.filter(a => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q));
    }

    // Sort
    articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Limit to 500 to ensure frontend receives enough data to fill lists
    articles = articles.slice(0, 500);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300", 
      },
      body: JSON.stringify({ articles }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news", details: error.message }),
    };
  }
};