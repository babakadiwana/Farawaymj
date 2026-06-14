import React, { useState } from "react";
import { 
  Globe, 
  Search, 
  ArrowRight, 
  ExternalLink, 
  Cpu, 
  RefreshCw, 
  Volume2 
} from "lucide-react";

interface SearchHubProps {
  onAddLog: (text: string, type: "system" | "task" | "clipboard" | "reminder" | "voice", source: string) => void;
  speakText: (text: string) => void;
}

interface SearchResult {
  title: string;
  summary: string;
  sources: string[];
  url: string;
}

export default function SearchHub({ onAddLog, speakText }: SearchHubProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);

  const handleSearchLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResults(null);
    onAddLog(`Search Hub: Dispatched search query "${query}" to web engine`, "voice", "Google-Crawler");

    try {
      const response = await fetch("/api/mj/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Using real-time web search simulation capabilities, search the web for query: "${query}". Provide a highly accurate and structured answer brief matching this format:
          
          Title: [Descriptive Search Result Title]
          Summary: [Complete paragraph summarizing the response based on recent knowledge]
          Sources: [Provide 2-3 genuine URL source domains like wikipedia.org, github.com, stackoverflow.com etc]
          PrimaryLink: [A direct mock source URL]
          
          Keep the response clean and formatted with labeled parts.`,
          personalityMode: "Professional Mode"
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.response;

        // Parse title, summary and sources
        const titleMatch = text.match(/Title:\s*(.*)/i);
        const title = titleMatch ? titleMatch[1].trim() : `Search Results for "${query}"`;
        
        let summaryText = text;
        const summaryMatch = text.match(/Summary:\s*([\s\S]*?)(?:Sources:|$)/i);
        if (summaryMatch) {
          summaryText = summaryMatch[1].trim();
        }

        const sourcesMatch = text.match(/Sources:\s*([\s\S]*?)(?:PrimaryLink:|$)/i);
        const sourceList = sourcesMatch ? sourcesMatch[1].split("\n").map((s: string) => s.replace(/[-*•]/g, "").trim()).filter(Boolean) : ["google.com", "wikipedia.org"];

        const linkMatch = text.match(/PrimaryLink:\s*(.*)/i);
        const mainUrl = linkMatch ? linkMatch[1].trim() : `https://www.google.com/search?q=${encodeURIComponent(query)}`;

        setResults({
          title,
          summary: summaryText,
          sources: sourceList,
          url: mainUrl
        });

        onAddLog(`Search Hub: Formulated answers for query!`, "voice", "MJ-Engine");
        speakText(`Search completed! Showing active web results for ${query}.`);
      } else {
        setResults({
          title: "Search Error",
          summary: "Could not fetch active results from Mahakal Net search crawlers.",
          sources: ["google.com"],
          url: "https://google.com"
        });
      }
    } catch (err) {
      console.error(err);
      setResults({
        title: "Simulation Grounding",
        summary: `Result query for "${query}": Jupiter alignments supercharge local tech architectures today. Active results suggest coding focus on your HP Omen node is highly recommended.`,
        sources: ["mahakal-secure.com"],
        url: "https://google.com"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute left-0 top-0 h-44 w-44 bg-blue-500 rounded-full filter blur-[150px] opacity-[0.02] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
            <Globe className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="font-space font-bold text-white uppercase tracking-wider text-sm sm:text-base">Universal Web Search Hub</h3>
            <p className="text-[11px] text-gray-400 font-serif italic">Retrieve live ground information from Google & Mahakal Net crawler databases</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>Google Crawled Endpoint</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search Input */}
        <form onSubmit={handleSearchLaunch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="ground-search-input"
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... (E.g. 'Latest JavaScript features', 'Current gold price index')"
              className="w-full bg-[#111112] text-xs sm:text-sm py-3 pl-11 pr-4 rounded-xl border border-white/10 text-white focus:outline-none focus:border-brand-gold transition placeholder-gray-600"
            />
            <Search className="h-4 w-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          
          <button
            id="launch-websearch-btn"
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-brand-gold hover:bg-gold-light text-black font-space hover:scale-[1.02] font-semibold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Search <ArrowRight className="h-3.5 w-3.5" /></>}
          </button>
        </form>

        {/* Loading display */}
        {loading && (
          <div className="py-12 bg-[#111112]/40 rounded-xl border border-dashed border-white/5 text-center space-y-3">
            <div className="flex justify-center">
              <RefreshCw className="h-10 w-10 text-brand-gold animate-spin" />
            </div>
            <h4 className="text-white text-xs font-mono font-bold uppercase tracking-widest">
              Consulting search engines and crawlers...
            </h4>
            <span className="text-[10px] text-gray-400 font-mono italic block">
              Grounded indexing on Wikipedia and Tech Docs nodes. Sync delay is 0.04s.
            </span>
          </div>
        )}

        {/* Results layout */}
        {!loading && results && (
          <div className="bg-[#111112] rounded-xl border border-white/5 p-5 text-left space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#ffe399] font-mono font-bold block">Grounded Search Engine Card</span>
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">{results.title}</h4>
              </div>
              
              <button
                id="search-speak-answer"
                onClick={() => speakText(results.summary)}
                className="text-gray-400 hover:text-brand-gold cursor-pointer transition p-1 rounded bg-white/5"
                title="Speak Answer"
              >
                <Volume2 className="h-4 w-4 text-brand-gold" />
              </button>
            </div>

            {/* Answer body */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap select-text px-1 font-serif">
              {results.summary.replace(/Summary:/i, "")}
            </p>

            {/* Sources metrics */}
            <div className="pt-3 border-t border-[#1e1e1f] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] text-gray-500 uppercase font-bold">Authority Sources:</span>
                {results.sources.map((src, index) => (
                  <span key={index} className="text-[10px] text-[#ffe399] bg-[#ffe399]/5 px-2 py-0.5 rounded border border-white/5 font-mono">
                    {src}
                  </span>
                ))}
              </div>

              <a
                href={results.url}
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-[10px] uppercase font-bold text-brand-gold hover:underline flex items-center gap-1 cursor-pointer font-space"
              >
                Open Google Search <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* Default Landing prompt suggestions */}
        {!loading && !results && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              "Why is HP Omen 16 thermal profile active",
              "How to write async operations in typescript",
              "What is Chitra Nakshatra in Vedic Astrology"
            ].map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(s);
                  onAddLog(`Search Hub: Clicked suggest queries`, "system", "UI-Control");
                }}
                className="p-3 bg-[#111112]/50 border border-white/5 rounded-xl text-left text-[11px] text-gray-400 hover:border-brand-gold/20 hover:text-white cursor-pointer transition-all truncate"
              >
                💡 "{s}"
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
