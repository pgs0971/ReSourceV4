import { useEffect, useState, useMemo } from "react";
import { 
  LayoutDashboard, 
  Globe, 
  Calendar, 
  RotateCcw, 
  ArrowUpDown, 
  TrendingDown, 
  Building2, 
  RefreshCw,
  Search,
  ExternalLink,
  Filter,
  Map as MapIcon,
  Plus,
  Minus
} from "lucide-react";

// --- Configuration & Data ---

const LOCATIONS = {
  // --- Major Insurance Hubs & Financial Centers ---
  "london": { lat: 51.5074, lng: -0.1278 },
  "bermuda": { lat: 32.3078, lng: -64.7505 },
  "hamilton": { lat: 32.2903, lng: -64.7703 },
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
  
  // US States & Cities
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
  "carolinas": { lat: 35.7596, lng: -79.0193 },
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

const FEEDS = [
  { url: "https://haggie.co.uk/feed/", source: "Haggie Partners" },
  { url: "https://www.reinsurancene.ws/feed/", source: "Reinsurance News" },
  { url: "https://www.artemis.bm/feed/", source: "Artemis" },
  { url: "https://www.insurancejournal.com/rss/news/international/", source: "Insurance Journal (Intl)" },
  { url: "https://www.insurancejournal.com/rss/news/national/", source: "Insurance Journal (US)" },
  { url: "https://www.insurancebusinessmag.com/us/rss/", source: "Insurance Business" },
  { url: "https://www.canadianunderwriter.ca/feed/", source: "Canadian Underwriter" },
  { url: "https://www.insurancetimes.co.uk/rss/news", source: "Insurance Times" },
  { url: "https://www.insuranceinsider.com/rss/content/source/all", source: "Insurance Insider" }
];

const findLocation = (text) => {
  if (!text) return null;
  const lowerText = text.toLowerCase();
  
  // Sort keys by length descending to match longer specific names first
  const keys = Object.keys(LOCATIONS).sort((a, b) => b.length - a.length);

  for (const key of keys) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(lowerText)) {
      return { name: key.charAt(0).toUpperCase() + key.slice(1), ...LOCATIONS[key] };
    }
  }
  return null;
};

const classifyArticle = (title = "", content = "") => {
  const text = (title + " " + content).toLowerCase();
  
  if (/\b(merger|acquisition|takeover|agrees|buy|sold|buying|stake|m&a|consolidate|combine|purchase|acquired|partner)\b/.test(text)) {
    return "Mergers & Acquisitions";
  }
  if (
    /\b(loss|catastrophe|hurricane|wildfire|flood|cyber|earthquake|typhoon|storm|disaster|claims|insured loss|nat cat|damage|peril|tornado|hail|outage|impact)\b/.test(
      text
    )
  ) {
    return "Major Loss";
  }
  return "General";
};

const cleanSummary = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, '').substring(0, 200) + (html.length > 200 ? "..." : "");
};

// --- Components ---

const Badge = ({ children, colorClass, icon: Icon }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm ${colorClass}`}>
    {Icon && <Icon size={10} />}
    {children}
  </span>
);

const ArticleCard = ({ article }) => {
  const isLoss = article.category === "Major Loss";
  
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-md shadow-sm mb-3 hover:shadow-md transition-all duration-200 group relative flex flex-col min-h-[180px]">
      <div className="flex items-start gap-3 h-full">
        <div className="pt-1 shrink-0">
           <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col h-full">
          
          {/* Title as Link */}
          <div className="mb-1">
            <a 
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-gray-900 leading-snug hover:text-blue-700 transition-colors line-clamp-2"
              title={article.title}
            >
              {article.title}
            </a>
          </div>
          
          {/* Summary Text */}
          <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed">
            {article.content || "No detailed summary available for this report."}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-2 mt-auto">
            {isLoss ? (
               <Badge colorClass="bg-[#1e3a8a] text-white">MAJOR LOSS</Badge>
            ) : (
               <Badge colorClass="bg-[#2563eb] text-white">M&A DEAL</Badge>
            )}
            
            {article.source.includes('Haggie') && (
                <Badge colorClass="bg-purple-100 text-purple-700 border border-purple-200">Partner News</Badge>
            )}
            
            {article.title.toLowerCase().includes('reinsurance') && (
                <Badge colorClass="bg-gray-100 text-gray-600 border border-gray-200">Reinsurance</Badge>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1 font-medium truncate max-w-[140px]">
              by <span className="text-gray-700 truncate font-bold">{article.source}</span>
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <span>{article.pubDate ? new Date(article.pubDate).toLocaleDateString('en-GB') : 'Recent'}</span>
              <a 
                href={article.link} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 text-blue-600 hover:underline font-medium"
              >
                Read <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColumnHeader = ({ title, count, icon: Icon, colorClass }) => (
  <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#f0f2f5] z-10 py-2">
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded ${colorClass} text-white shadow-sm`}>
        <Icon size={18} />
      </div>
      <h2 className={`text-lg font-black uppercase tracking-tight ${colorClass.replace("bg-", "text-")}`}>{title}</h2>
      <span className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">{count}</span>
    </div>
    <button className="text-gray-400 hover:text-blue-600 transition-colors bg-white p-1.5 rounded-full shadow-sm border border-transparent hover:border-gray-200">
      <RefreshCw size={14} />
    </button>
  </div>
);

const FilterBar = ({ 
  placeholder, 
  searchQuery, 
  onSearchChange, 
  titleFilter, 
  onTitleFilterChange, 
  sectorFilter, 
  onSectorFilterChange, 
  availableArticles 
}) => (
  <div className="bg-white p-2 rounded border border-gray-200 mb-4 space-y-2 shadow-sm">
    <div className="flex gap-2">
      <div className="relative flex-1">
        <select 
          value={sectorFilter}
          onChange={(e) => onSectorFilterChange(e.target.value)}
          className="w-full pl-2 pr-6 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none cursor-pointer"
        >
          <option value="">All Sectors</option>
          <option value="property">Property</option>
          <option value="casualty">Casualty</option>
          <option value="reinsurance">Reinsurance</option>
          <option value="specialty">Specialty</option>
          <option value="cyber">Cyber</option>
        </select>
        <Filter className="absolute right-2 top-1.5 text-gray-400 pointer-events-none" size={12} />
      </div>
      <div className="relative flex-[2]">
        <input 
          type="text" 
          placeholder={placeholder} 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
        />
        <Search className="absolute left-2.5 top-1.5 text-gray-400" size={12} />
      </div>
    </div>
    <div className="relative">
         <select 
            value={titleFilter}
            onChange={(e) => onTitleFilterChange(e.target.value)}
            className="w-full pl-2 pr-6 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-400 focus:outline-none appearance-none cursor-pointer hover:border-gray-300 truncate"
         >
          <option value="">Filter by Article Title...</option>
          {availableArticles.map(article => (
              <option key={article.id} value={article.title}>{article.title.substring(0, 60)}...</option>
          ))}
        </select>
        <div className="absolute right-2.5 top-2.5 pointer-events-none border-t-4 border-t-gray-400 border-x-4 border-x-transparent w-0 h-0"></div>
    </div>
  </div>
);

// --- Map Component with Zoom ---
const ZoomableMap = ({ items, getPinStyle }) => {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });

    const handleWheel = (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setScale(s => Math.min(Math.max(s * delta, 1), 5));
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPan({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setOffset({
            x: e.clientX - startPan.x,
            y: e.clientY - startPan.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    const zoomIn = () => setScale(s => Math.min(s * 1.2, 5));
    const zoomOut = () => setScale(s => Math.max(s / 1.2, 1));
    const resetZoom = () => { setScale(1); setOffset({x:0, y:0}); };

    return (
        <div className="w-full h-full bg-[#020617] relative overflow-hidden flex items-center justify-center p-4">
             {/* Map Stats Overlay */}
             <div className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-md text-green-400 p-3 rounded border border-green-500/30 text-xs font-mono shadow-2xl pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <strong className="text-green-400">LIVE GEO-INTEL FEED</strong>
                </div>
                <div className="text-gray-400">Active Nodes: {items.length}</div>
             </div>

             {/* Zoom Controls */}
             <div className="absolute top-6 right-6 z-30 flex flex-col gap-2 bg-[#1e293b] rounded-lg border border-gray-700 p-1 shadow-xl">
                <button onClick={zoomIn} className="p-2 text-white hover:bg-blue-600 rounded transition-colors" title="Zoom In"><Plus size={16}/></button>
                <button onClick={zoomOut} className="p-2 text-white hover:bg-blue-600 rounded transition-colors" title="Zoom Out"><Minus size={16}/></button>
                <button onClick={resetZoom} className="p-2 text-white hover:bg-blue-600 rounded transition-colors" title="Reset View"><RotateCcw size={16}/></button>
             </div>
             
             {/* Map Window */}
             <div 
                className="relative w-full max-w-6xl aspect-[2/1] bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-gray-800 cursor-move"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
             >
                <div 
                    style={{ 
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        transformOrigin: 'center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                    className="w-full h-full relative"
                >
                    {/* Map Image */}
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg" 
                        alt="World Map" 
                        className="w-full h-full object-cover opacity-40 mix-blend-screen pointer-events-none"
                        style={{ filter: 'grayscale(100%) contrast(1.2) brightness(0.7)' }} 
                    />
                    
                    {/* Map Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                    {/* Pins */}
                    {items.map((article) => {
                        const style = getPinStyle(article.location.lat, article.location.lng);
                        const isLoss = article.category === "Major Loss";
                        const pinScale = 1 / scale; 
                        
                        return (
                            <div 
                                key={article.id}
                                className="absolute -ml-1.5 -mt-1.5 cursor-pointer group z-20 hover:z-50"
                                style={{ ...style }}
                            >
                                <div style={{ transform: `scale(${pinScale})` }}>
                                    <div className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${isLoss ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    <div className={`relative w-3 h-3 rounded-full border border-white/50 shadow-lg ${isLoss ? 'bg-red-600' : 'bg-blue-600'}`}></div>
                                </div>
                                
                                <div 
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 bg-gray-900/90 backdrop-blur text-white p-3 text-xs rounded-md shadow-2xl border border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50"
                                    style={{ transform: `translateX(-50%) scale(${pinScale})`, transformOrigin: 'bottom center' }}
                                >
                                    <div className="flex items-center justify-between mb-1 border-b border-gray-700 pb-1">
                                        <strong className={`${isLoss ? 'text-red-400' : 'text-blue-400'} uppercase font-bold tracking-wider`}>{article.location.name}</strong>
                                    </div>
                                    <p className="leading-relaxed text-gray-300 mb-2 line-clamp-2">{article.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
             </div>
          </div>
    );
}

// --- Main Application ---

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("dashboard"); 
  const [currentTime, setCurrentTime] = useState(new Date());

  // Filter States
  const [lossSearch, setLossSearch] = useState("");
  const [lossTitleFilter, setLossTitleFilter] = useState("");
  const [lossSector, setLossSector] = useState("");
  
  const [maSearch, setMaSearch] = useState("");
  const [maTitleFilter, setMaTitleFilter] = useState("");
  const [maSector, setMaSector] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    
    const RSS2JSON_BASE = "https://api.rss2json.com/v1/api.json";

    try {
      const feedPromises = FEEDS.map(async (feed) => {
        try {
          const res = await fetch(`${RSS2JSON_BASE}?rss_url=${encodeURIComponent(feed.url)}&count=50`);
          if (!res.ok) throw new Error(`Failed to fetch ${feed.source}`);
          const data = await res.json();
          
          if (data.status !== 'ok') return []; 

          return data.items.map(item => {
            const title = item.title || "";
            const link = item.link || "";
            const pubDate = item.pubDate || new Date().toISOString(); 
            const rawSummary = item.content || item.description || "";
            const summary = cleanSummary(rawSummary);
            
            const location = findLocation(title) || findLocation(rawSummary);
            const category = classifyArticle(title, rawSummary);

            return {
              id: link || Math.random().toString(36).substr(2, 9),
              title,
              link,
              pubDate,
              content: summary,
              source: feed.source, 
              category,
              location
            };
          });
        } catch (err) {
          console.warn(`Error processing feed ${feed.source}:`, err);
          return [];
        }
      });

      const results = await Promise.all(feedPromises);
      const allArticles = results.flat();

      const uniqueArticles = [];
      const seenLinks = new Set();
      
      allArticles.forEach(article => {
        if (!seenLinks.has(article.link)) {
          seenLinks.add(article.link);
          uniqueArticles.push(article);
        }
      });

      uniqueArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      setItems(uniqueArticles);
    } catch (err) {
      console.error("Critical error fetching news:", err);
      // Removed demo data fallback as requested
      setItems([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    const interval = setInterval(fetchArticles, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  // Filtering Logic
  const filterArticles = (articles, search, titleFilter, sector) => {
      return articles.filter(item => {
          const content = (item.title + " " + (item.content || "")).toLowerCase();
          
          // Search Query Check
          const matchesSearch = search === "" || content.includes(search.toLowerCase());
          
          // Title Dropdown Check
          const matchesTitle = titleFilter === "" || item.title === titleFilter;
          
          // Sector Check (Only if a sector is selected)
          const matchesSector = sector === "" || content.includes(sector.toLowerCase());

          return matchesSearch && matchesTitle && matchesSector;
      });
  };

  // Split and Filter content
  const majorLossesRaw = useMemo(() => items.filter(i => i.category === "Major Loss"), [items]);
  const majorLosses = useMemo(() => filterArticles(majorLossesRaw, lossSearch, lossTitleFilter, lossSector), [majorLossesRaw, lossSearch, lossTitleFilter, lossSector]);

  const mergersRaw = useMemo(() => items.filter(i => i.category === "Mergers & Acquisitions"), [items]);
  const mergers = useMemo(() => filterArticles(mergersRaw, maSearch, maTitleFilter, maSector), [mergersRaw, maSearch, maTitleFilter, maSector]);

  // Map Logic
  const mapItems = useMemo(() => items.filter(i => i.location), [items]);
  
  const getPinStyle = (lat, lng) => {
    const top = (90 - lat) / 1.8; 
    const left = (lng + 180) / 3.6; 
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] font-sans text-slate-800 overflow-hidden">
      
      {/* HEADER */}
      <header className="bg-[#0f172a] text-white px-4 py-2.5 shadow-md flex items-center justify-between z-50 shrink-0 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Globe size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight leading-none text-white">Re:Source Live</h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Global Market Intelligence</p>
          </div>
        </div>

        {/* Center Navigation Toggle */}
        <div className="hidden md:flex bg-[#1e293b] p-1 rounded-lg border border-gray-700">
          <button 
            onClick={() => setView("dashboard")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all ${view === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            <LayoutDashboard size={14} /> Dashboard
          </button>
          <button 
            onClick={() => setView("map")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all ${view === 'map' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            <MapIcon size={14} /> Global Map
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex bg-[#1e293b] rounded-md border border-gray-700 overflow-hidden">
              <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 border-r border-gray-700">
                <Calendar size={12} /> Year
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700">
                Month
              </button>
          </div>
          
          <button className="flex items-center gap-1 bg-white text-gray-900 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-100 shadow-sm">
            <ArrowUpDown size={12} /> Newest
          </button>
          <button onClick={fetchArticles} className="flex items-center gap-1 bg-[#1e293b] border border-gray-700 px-3 py-1.5 rounded text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </header>

      {/* TICKER BAR */}
      <div className="bg-black border-b-2 border-blue-600 h-8 flex items-center overflow-hidden relative z-40 shrink-0">
         <div className="absolute left-0 top-0 bottom-0 bg-[#0f172a] px-4 z-10 flex items-center gap-2 border-r border-gray-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-xs text-blue-400 font-bold tracking-wider">
                {currentTime.toLocaleDateString('en-GB')} {currentTime.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}
            </span>
         </div>
         <div className="ticker-wrap ml-40">
            <div className="ticker-move text-xs font-mono font-bold tracking-wide flex items-center">
              {items.length > 0 ? (
                  items.concat(items).slice(0, 15).map((item, i) => ( 
                     <span key={i} className="inline-flex items-center mx-6">
                        <span className="text-yellow-500 mr-2">LATEST:</span> 
                        <span className="text-gray-200">{item.title.toUpperCase()}</span> 
                     </span>
                  ))
              ) : (
                  <span className="text-gray-500 mx-6">Loading live feed...</span>
              )}
            </div>
         </div>
      </div>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-hidden relative">
        {view === 'dashboard' ? (
           <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              
              {/* Left Column: MAJOR LOSSES */}
              <div className="flex flex-col h-full border-r border-gray-200 bg-[#f0f2f5] p-6 overflow-hidden">
                <ColumnHeader title="Major Losses" count={majorLosses.length} icon={TrendingDown} colorClass="bg-[#1e3a8a]" />
                <FilterBar 
                    placeholder="Search losses..." 
                    searchQuery={lossSearch}
                    onSearchChange={setLossSearch}
                    titleFilter={lossTitleFilter}
                    onTitleFilterChange={setLossTitleFilter}
                    sectorFilter={lossSector}
                    onSectorFilterChange={setLossSector}
                    availableArticles={majorLossesRaw}
                />
                
                <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {loading && items.length === 0 && <div className="text-center py-10 text-gray-500 italic text-sm">Scanning global feeds...</div>}
                    {!loading && majorLosses.length === 0 && <div className="text-center py-10 text-gray-500 italic text-sm">No major losses reported.</div>}
                    {majorLosses.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
              </div>

              {/* Right Column: M&A */}
              <div className="flex flex-col h-full bg-[#f0f2f5] p-6 overflow-hidden">
                <ColumnHeader title="Mergers & Acquisitions" count={mergers.length} icon={Building2} colorClass="bg-[#2563eb]" />
                 <FilterBar 
                    placeholder="Search M&A..." 
                    searchQuery={maSearch}
                    onSearchChange={setMaSearch}
                    titleFilter={maTitleFilter}
                    onTitleFilterChange={setMaTitleFilter}
                    sectorFilter={maSector}
                    onSectorFilterChange={setMaSector}
                    availableArticles={mergersRaw}
                 />
                
                 <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {loading && items.length === 0 && <div className="text-center py-10 text-gray-500 italic text-sm">Scanning global feeds...</div>}
                    {!loading && mergers.length === 0 && <div className="text-center py-10 text-gray-500 italic text-sm">No deals reported.</div>}
                    {mergers.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
              </div>

           </div>
        ) : (
          <ZoomableMap items={mapItems} getPinStyle={getPinStyle} />
        )}
      </main>
    </div>
  );
}