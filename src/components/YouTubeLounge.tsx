import React, { useState, useEffect } from "react";
import { 
  Play, 
  Plus, 
  Trash2, 
  Search, 
  Radio, 
  Music, 
  Check, 
  Sparkles, 
  Youtube, 
  RefreshCw 
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
}

interface YouTubeLoungeProps {
  onAddLog: (text: string, type: "system" | "task" | "clipboard" | "reminder" | "voice", source: string) => void;
  speakText: (text: string) => void;
}

const PRESET_TRACKS: Track[] = [
  {
    id: "preset-1",
    title: "Shiv Tandav Stotram (Traditional Devotional)",
    artist: "Sacred Chants of Shiva",
    youtubeId: "vBOf9pZpIaw"
  },
  {
    id: "preset-2",
    title: "Cyberpunk Synthwave - Dynamic Coding Beats",
    artist: "Neon Programmer Loop",
    youtubeId: "4xDzrJKXOOY"
  },
  {
    id: "preset-3",
    title: "Lofi Hip Hop Radio - Beats to Sync/Relax to",
    artist: "Mahakal Ambient Lounge",
    youtubeId: "jfKfPfyJRdk"
  },
  {
    id: "preset-4",
    title: "Calm Classical Instrumental - Piano Focus",
    artist: "Deep focus study tracks",
    youtubeId: "9QnIdQ96_I4"
  }
];

export default function YouTubeLounge({ onAddLog, speakText }: YouTubeLoungeProps) {
  // Playlist Storage
  const [playlist, setPlaylist] = useState<Track[]>(() => {
    const saved = localStorage.getItem("mj_custom_playlist");
    return saved ? JSON.parse(saved) : [
      {
        id: "cust-1",
        title: "Mahakal HP-Omen Session Vibe",
        artist: "Mahakal Devotee Mix",
        youtubeId: "8Z72WnZ_H4A"
      }
    ];
  });

  const [activeYoutubeId, setActiveYoutubeId] = useState("vBOf9pZpIaw");
  const [activeTrackName, setActiveTrackName] = useState("Shiv Tandav Stotram (Traditional Devotional)");

  // Add Custom Track Form states
  const [searchUrlInput, setSearchUrlInput] = useState("");
  const [trackNameInput, setTrackNameInput] = useState("");
  const [trackArtistInput, setTrackArtistInput] = useState("");
  const [songQuery, setSongQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  // Persist playlist changes
  useEffect(() => {
    localStorage.setItem("mj_custom_playlist", JSON.stringify(playlist));
  }, [playlist]);

  const runAutoSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsSearching(true);
    onAddLog(`Youtube Vocal Search: Querying song patterns for "${queryText}"`, "voice", "Youtube-Search");
    try {
      const res = await fetch("/api/mj/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Look up YouTube search keyword "${queryText}". Formulate a structured JSON with 3 accurate or highly matching search-result candidates. Each item should have structure:
          { "title": "Song Title", "artist": "Artist name", "youtubeId": "an actual 11-char YouTube ID matching this" }.
          Only return the raw JSON object matching this array structure.`,
          personalityMode: "Retro Cyberpunk Mode 🚀"
        })
      });
      if (res.ok) {
        const data = await res.json();
        const rawText = data.response;
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setSearchResults(parsed);
          if (parsed.length > 0) {
            setActiveYoutubeId(parsed[0].youtubeId);
            setActiveTrackName(`${parsed[0].title} - ${parsed[0].artist}`);
            onAddLog(`Media Hub: Auto-playing voiced YouTube video "${parsed[0].title}"!`, "system", "UI-Control");
            speakText(`Playing track: ${parsed[0].title}. Enjoy!`);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handleCheckAutoQuery = () => {
      const autoQuery = localStorage.getItem("youtube_auto_query");
      if (autoQuery) {
        localStorage.removeItem("youtube_auto_query");
        setSongQuery(autoQuery);
        runAutoSearch(autoQuery);
      }
    };
    handleCheckAutoQuery();
    const interval = setInterval(handleCheckAutoQuery, 1000);
    return () => clearInterval(interval);
  }, []);

  const extractYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handlePlayTrack = (track: Track) => {
    setActiveYoutubeId(track.youtubeId);
    setActiveTrackName(`${track.title} - ${track.artist}`);
    onAddLog(`Media Hub: Playing YouTube track "${track.title}"`, "system", "UI-Control");
    speakText(`Playing track, ${track.title}. Enjoy the tune!`);
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackNameInput.trim() || !searchUrlInput.trim()) return;

    const extractedId = extractYoutubeId(searchUrlInput);
    if (extractedId.length !== 11) {
      alert("Invalid YouTube Link or ID. Please double check.");
      return;
    }

    const newTrack: Track = {
      id: `cust-${Date.now()}`,
      title: trackNameInput,
      artist: trackArtistInput.trim() || "Mahakal Guest",
      youtubeId: extractedId
    };

    setPlaylist(prev => [...prev, newTrack]);
    onAddLog(`Playlist: Staged custom track "${newTrack.title}"`, "task", "Playlist-Architect");
    
    // Clear inputs
    setTrackNameInput("");
    setTrackArtistInput("");
    setSearchUrlInput("");
  };

  const handleDeleteTrack = (id: string) => {
    const filtered = playlist.filter(t => t.id !== id);
    setPlaylist(filtered);
    onAddLog(`Playlist: Track deleted from local memory`, "system", "UI-Control");
  };

  // Search simulator with Gemini support or rule fallback
  const handleYoutubeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songQuery.trim()) return;

    setIsSearching(true);
    onAddLog(`Youtube: Querying song patterns for "${songQuery}"`, "voice", "Youtube-Search");

    try {
      // Prompt Gemini on client to formulate best video candidates
      const res = await fetch("/api/mj/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Look up YouTube search keyword "${songQuery}". Formulate a structured JSON with 3 accurate or highly matching search-result candidates. Each item should have structure:
          { "title": "Song Title", "artist": "Artist name", "youtubeId": "an actual 11-char YouTube ID matching this" }.
          Only return the raw JSON object matching this array structure.`,
          personalityMode: "Retro Cyberpunk Mode 🚀"
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.response;
        // Parse candidates
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setSearchResults(parsed);
        } else {
          // Fallback rule
          setSearchResults([
            {
              id: "searched-1",
              title: `${songQuery} (Acoustic Cover)`,
              artist: "YouTube Artist",
              youtubeId: "dQw4w9WgXcQ"
            }
          ]);
        }
      }
    } catch (err) {
      console.error(err);
      setSearchResults([
        {
          id: "searched-1",
          title: `${songQuery} (Remix version)`,
          artist: "Sound Adapter",
          youtubeId: "dQw4w9WgXcQ"
        }
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute right-0 top-0 h-44 w-44 bg-brand-gold rounded-full filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-white/5 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
            <Youtube className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="font-space font-bold text-white uppercase tracking-wider text-sm sm:text-base">M-J YouTube Audio Lounge</h3>
            <p className="text-[11px] text-gray-400 font-serif italic">Play online songs and architect custom visual telemetry playlists</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-extrabold">Omen Audio Driver Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Embedded Player & presets */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Real YouTube Player Frame */}
          <div className="relative w-full aspect-video rounded-2xl border border-white/5 overflow-hidden bg-black shadow-inner">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}?autoplay=1&enablejsapi=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="p-4 bg-[#111112] rounded-xl border border-white/5 flex items-center justify-between gap-3 text-left">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#ffe399] font-mono font-bold block">Currently Tuned Song</span>
              <h4 className="text-white text-xs sm:text-sm font-semibold tracking-tight mt-0.5 truncate max-w-[280px] sm:max-w-[360px]">{activeTrackName}</h4>
            </div>
            
            <div className="flex items-center gap-1 shrink-0 bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[9px] font-mono select-none text-brand-gold">
              <Radio className="h-3 w-3 animate-pulse" /> 
              <span>PCM STEREO</span>
            </div>
          </div>

          {/* Quick Preset Classics selection */}
          <div className="space-y-3">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5 font-space text-left">
              <Music className="h-3.5 w-3.5 text-brand-gold" /> YouTube Hot Preset Gems
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {PRESET_TRACKS.map((t) => {
                const isActive = t.youtubeId === activeYoutubeId;
                return (
                  <button
                    id={`preset-${t.id}`}
                    key={t.id}
                    onClick={() => handlePlayTrack(t)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                      isActive 
                        ? "bg-brand-gold/10 border-brand-gold/30 text-brand-gold font-bold" 
                        : "bg-[#111112] border-white/5 hover:border-brand-gold/20 text-gray-300"
                    }`}
                  >
                    <div className="truncate">
                      <h5 className="truncate font-semibold">{t.title}</h5>
                      <p className="text-[9px] text-gray-500 mt-0.5 truncate">{t.artist}</p>
                    </div>
                    <Play className={`h-4.5 w-4.5 shrink-0 ml-1 ${isActive ? "text-brand-gold fill-current animate-pulse" : "text-gray-500"}`} />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Playlist & Search */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Search Track Simulator */}
          <div className="bg-[#111112] border border-white/5 p-4 rounded-xl space-y-3 text-left">
            <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400 font-bold block">YouTube Search Engines Query</span>
            <form onSubmit={handleYoutubeSearch} className="flex gap-2">
              <input
                type="text"
                value={songQuery}
                onChange={(e) => setSongQuery(e.target.value)}
                placeholder="Search song keyword (E.g. Shiv Tandav, Alan Walker)"
                className="flex-1 bg-[#050505] border border-white/10 rounded-lg text-xs py-1.5 px-3 text-white focus:outline-none focus:border-brand-gold"
              />
              <button
                id="youtube-search-btn"
                type="submit"
                disabled={isSearching}
                className="p-1.5 bg-white/5 border border-white/10 hover:border-brand-gold text-white font-bold rounded-lg cursor-pointer transition"
              >
                {isSearching ? <RefreshCw className="h-4 w-4 animate-spin text-brand-gold" /> : <Search className="h-4 w-4" />}
              </button>
            </form>

            {/* Simulated search list */}
            {searchResults.length > 0 && (
              <div className="space-y-1.5 border-t border-white/5 pt-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                {searchResults.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-white/5 rounded-md text-[11px] text-gray-300">
                    <span className="truncate pr-2 font-mono">{t.title} - {t.artist}</span>
                    <button
                      type="button"
                      onClick={() => {
                        // Play & copy to playlist
                        handlePlayTrack(t);
                        setPlaylist(prev => [{ ...t, id: `cust-search-${Date.now()}` }, ...prev]);
                      }}
                      className="text-[9px] uppercase tracking-wider bg-brand-gold/15 text-brand-gold hover:bg-brand-gold hover:text-black font-extrabold px-2 py-0.5 rounded cursor-pointer"
                    >
                      Play + Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sync Playlist Architect */}
          <div className="bg-[#111112] border border-white/5 p-4 rounded-xl flex-1 flex flex-col gap-4 text-left">
            <span className="text-[10px] uppercase tracking-widest font-space text-brand-gold font-bold border-b border-white/5 pb-2">
              Session Playlist Architect ({playlist.length})
            </span>
            
            {/* List */}
            <div className="flex-1 space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {playlist.length === 0 ? (
                <span className="text-gray-600 block italic text-xs py-10 text-center">Playlist is empty. Add links below or search tracks!</span>
              ) : (
                playlist.map((track) => {
                  const isActive = track.youtubeId === activeYoutubeId;
                  return (
                    <div
                      id={`playlist-item-${track.id}`}
                      key={track.id}
                      onClick={() => handlePlayTrack(track)}
                      className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition text-xs ${
                        isActive 
                          ? "bg-brand-gold/5 border-brand-gold/25 text-brand-gold" 
                          : "bg-[#050505] border-white/5 hover:border-white/10 text-gray-300"
                      }`}
                    >
                      <div className="truncate text-left max-w-[180px] sm:max-w-[240px]">
                        <h6 className="font-semibold truncate">{track.title}</h6>
                        <span className="text-[9px] font-mono text-gray-500 block truncate">{track.artist} | ID: {track.youtubeId}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Play className={`h-3 w-3 ${isActive ? "text-brand-gold animate-bounce" : "text-gray-400"}`} />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTrack(track.id);
                          }}
                          className="hover:text-red-400 text-gray-500 transition cursor-pointer p-1 rounded"
                          title="Delete from playlist"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Custom Track Submission form */}
            <form onSubmit={handleAddTrack} className="border-t border-white/5 pt-3.5 space-y-2 text-xs">
              <span className="text-[9px] text-gray-500 uppercase tracking-wider block font-bold font-mono">Stage custom track manually</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Song Title"
                  value={trackNameInput}
                  onChange={(e) => setTrackNameInput(e.target.value)}
                  className="bg-[#050505] border border-white/10 p-1.5 rounded text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Artist"
                  value={trackArtistInput}
                  onChange={(e) => setTrackArtistInput(e.target.value)}
                  className="bg-[#050505] border border-white/10 p-1.5 rounded text-white focus:outline-none"
                />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="YouTube Video Link or 11-char ID"
                  value={searchUrlInput}
                  onChange={(e) => setSearchUrlInput(e.target.value)}
                  className="flex-1 bg-[#050505] border border-white/10 p-1.5 rounded text-white focus:outline-none font-mono text-[11px]"
                />
                <button
                  id="playlist-add-btn"
                  type="submit"
                  className="bg-brand-gold text-black text-[10px] font-bold uppercase py-1.5 px-3 rounded cursor-pointer hover:bg-gold-light shrink-0"
                >
                  Add Song
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
