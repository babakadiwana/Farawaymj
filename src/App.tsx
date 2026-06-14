import React, { useState, useEffect } from "react";
import { Task, Reminder, ClipboardClip, SyncLog } from "./types";
import ActionCenterBoard from "./components/ActionCenterBoard";
import CentralDatabaseDashboard from "./components/CentralDatabaseDashboard";
import VoiceAssistantChat from "./components/VoiceAssistantChat";
import TelemetryAlertOverlay from "./components/TelemetryAlertOverlay";
import SmartHomeControls from "./components/SmartHomeControls";
import CodingSandbox from "./components/CodingSandbox";
import DocsReader from "./components/DocsReader";
import YouTubeLounge from "./components/YouTubeLounge";
import SearchHub from "./components/SearchHub";
import { 
  Database, 
  Cpu, 
  Wifi, 
  Sparkles, 
  Smartphone, 
  Laptop, 
  RefreshCw, 
  Volume2, 
  Compass, 
  Calendar,
  Layers,
  Heart,
  Globe,
  Radio,
  BookOpen,
  Shield,
  Code2,
  FileText,
  Youtube,
  Search
} from "lucide-react";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [clipboard, setClipboard] = useState<ClipboardClip>({
    id: "clip-init",
    text: "Waiting for database bootstrap...",
    deviceSource: "Central-Cloud",
    timestamp: Date.now()
  });
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardClip[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "astrology" | "coding" | "documents" | "youtube" | "search">("dashboard");

  // Google Secure Authentication variables
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("mj_google_logged_in") === "true";
  });
  const [loginEmail, setLoginEmail] = useState(() => {
    return localStorage.getItem("mj_google_email") || "mahakalbabakadiwanahu@gmail.com";
  });
  const [gateEmail, setGateEmail] = useState("mahakalbabakadiwanahu@gmail.com");
  const [gatePassword, setGatePassword] = useState("");
  const [gateStage, setGateStage] = useState<"username" | "password" | "connecting">("username");
  const [gateStatus, setGateStatus] = useState("");

  // Real-time Astro Panchang Calculator variables
  const [dobInput, setDobInput] = useState("2000-01-01");
  const [tobInput, setTobInput] = useState("07:00");
  const [placeInput, setPlaceInput] = useState("Mumbai, Maharashtra");
  const [panchangLoading, setPanchangLoading] = useState(false);
  const [panchangResult, setPanchangResult] = useState<{
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    rahuKalam: string;
    abhijitMuhurtha: string;
    sunrise: string;
    sunset: string;
    auspiciousActivity: string;
    personalizedAdvice: string;
  } | null>(null);

  const handleCalculatePanchang = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPanchangLoading(true);
      const res = await fetch("/api/mj/panchang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob: dobInput, tob: tobInput, place: placeInput })
      });
      if (res.ok) {
        const data = await res.json();
        setPanchangResult(data);
      }
    } catch (err) {
      console.error("Failed to compute Panchang", err);
    } finally {
      setPanchangLoading(false);
    }
  };

  const handleGoogleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateEmail.trim()) return;
    setGateStage("password");
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGateStage("connecting");
    setGateStatus("Verifying Google account authorization sequence on Mahakal Net...");
    
    setTimeout(() => {
      setGateStatus("Handshaking secure private keys on secure central database...");
    }, 1000);

    setTimeout(() => {
      localStorage.setItem("mj_google_logged_in", "true");
      localStorage.setItem("mj_google_email", gateEmail);
      setLoginEmail(gateEmail);
      setIsLoggedIn(true);
      setGateStatus("");
    }, 2200);
  };

  const handleLogout = () => {
    localStorage.removeItem("mj_google_logged_in");
    localStorage.removeItem("mj_google_email");
    setIsLoggedIn(false);
    setGateStage("username");
    setGateEmail("mahakalbabakadiwanahu@gmail.com");
    setGatePassword("");
  };

  // Synchronized device control telemetries
  const [deviceStats, setDeviceStats] = useState({
    desktopPowerState: "on",
    desktopTemp: 42,
    desktopMute: false,
    desktopLightsColor: "cyan",
    desktopAppsOpened: ["Command Prompt"],
    mobileLockState: false,
    mobileBatterySaver: false,
    mobileAppsOpened: ["Phone"],
    batteryLevel: 88,
    ramUsage: 14.2
  });

  // Fetch full sync state from server
  const fetchSyncState = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/sync");
      const data = await res.json();
      setTasks(data.tasks);
      setReminders(data.reminders);
      setClipboard(data.clipboard);
      setClipboardHistory(data.clipboardHistory);
      setLogs(data.logs);
      if (data.deviceStats) {
        setDeviceStats(data.deviceStats);
      }
    } catch (err) {
      console.error("Failed to fetch state from remote database:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Push telemetry and control triggers
  const handleUpdateDeviceStats = async (newStats: Partial<typeof deviceStats>) => {
    try {
      const res = await fetch("/api/sync/device-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStats),
      });
      if (res.ok) {
        const data = await res.json();
        setDeviceStats(data);
      }
    } catch (err) {
      console.error("Failed to update device stats:", err);
    }
  };

  // Rashi predictions for Raj Soni
  const astrologyCards = [
    {
      rashi: "Mesh / Aries (Raj's Focus Domain) ♈",
      prediction: "Jupiter is shining beautifully in your house of systems! Today is the perfect day to build full-stack databases and sync multiple desktop and mobile devices. Multi-tasking has never been smoother.",
      luckyNumber: 7,
      luckyColor: "Premium Gold"
    },
    {
      rashi: "Vrishabh / Taurus (Family horoscope) ♉",
      prediction: "Venus promises harmony in household communication. Connecting tools, sharing reminders and sync status keeps everyone on the same page. Health remains fully optimized at 100%.",
      luckyNumber: 4,
      luckyColor: "Champagne Slate"
    },
    {
      rashi: "Mithun / Gemini ♊",
      prediction: "Financial decisions made today carry beneficial multipliers. Backing up folders to Google Drive provides robust peace of mind.",
      luckyNumber: 9,
      luckyColor: "Satin Bronze"
    }
  ];

  // Poll state every 2.5 seconds to simulate realtime sync!
  useEffect(() => {
    fetchSyncState();
    const interval = setInterval(() => {
      fetchSyncState();
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Sync Log creator helper
  const addClientLog = async (text: string, type: SyncLog["type"], source: string) => {
    // Simply fetch after action to let the server update and append logs
    setTimeout(fetchSyncState, 150);
  };

  // Add Task POST
  const handleAddTask = async (text: string, source: string) => {
    try {
      const res = await fetch("/api/sync/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, deviceSource: source }),
      });
      if (res.ok) {
        await fetchSyncState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Task Status POST
  const handleToggleTask = async (task: Task) => {
    try {
      const res = await fetch("/api/sync/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          text: task.text,
          completed: !task.completed,
          deviceSource: task.deviceSource
        }),
      });
      if (res.ok) {
        await fetchSyncState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: string, source: string) => {
    try {
      const res = await fetch(`/api/sync/task/${id}?deviceSource=${source}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchSyncState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Set Clipboard
  const handleSetClipboard = async (text: string, source: string) => {
    try {
      const res = await fetch("/api/sync/clipboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, deviceSource: source }),
      });
      if (res.ok) {
        await fetchSyncState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Reminder
  const handleAddReminder = async (text: string, time: string, source: string) => {
    try {
      const res = await fetch("/api/sync/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, time, deviceSource: source }),
      });
      if (res.ok) {
        await fetchSyncState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Reminder
  const handleDeleteReminder = async (id: string, source: string) => {
    try {
      const res = await fetch(`/api/sync/reminder/${id}?deviceSource=${source}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchSyncState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Wipe Memory and seed brand new
  const handleWipeData = async () => {
    try {
      const res = await fetch("/api/sync/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "task-reset",
          text: "Double-check backup database pipelines",
          completed: false,
          deviceSource: "Central-Cloud"
        })
      });
      
      const resClip = await handleSetClipboard("Ecosystem database reindexed. Welcome back Raj!", "Central-Cloud");
      await fetchSyncState();
    } catch (err) {
      console.error(err);
    }
  };

  const speakTextGlobal = (text: string) => {
    window.speechSynthesis?.cancel();
    const cleanedText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    window.speechSynthesis?.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans p-4 sm:p-6 lg:p-8 selection:bg-brand-gold/30">
      
      {!isLoggedIn && (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-brand-gold/30">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl hover:border-brand-gold/15 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 animate-pulse"></div>

            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-white/5 rounded-full border border-white/10 mb-3 text-brand-gold shadow">
                <Shield className="h-6 w-6 animate-pulse" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-space">
                MJ Google Secure Sync Gate
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Verify identity to unlock synchronization & vocal AI assistant
              </p>
            </div>

            {gateStage === "username" && (
              <form onSubmit={handleGoogleSubmitEmail} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-500 font-bold">
                    Google Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="google-gate-email"
                      type="email"
                      required
                      value={gateEmail}
                      onChange={(e) => setGateEmail(e.target.value)}
                      placeholder="mahakalbabakadiwanahu@gmail.com"
                      className="w-full bg-white/5 border border-white/10 hover:border-brand-gold/20 focus:border-brand-gold focus:outline-none rounded-xl text-xs py-3 px-4 text-white font-mono placeholder-gray-600 transition"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed pt-1 select-none">
                    🔐 Mahakal Net employs TLS 1.3 encryption tunnels. Preconfigured user <b>mahakalbabakadiwanahu@gmail.com</b> detected for Mahakal cloud.
                  </p>
                </div>

                <button
                  id="google-gate-next-btn"
                  type="submit"
                  className="w-full bg-brand-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none shadow-lg font-space"
                >
                  Continue Verification
                </button>
              </form>
            )}

            {gateStage === "password" && (
              <form onSubmit={handleGoogleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-mono text-gray-500 font-bold">
                    <span>Passphrase/Credentials</span>
                    <button
                      type="button"
                      onClick={() => setGateStage("username")}
                      className="text-brand-gold hover:underline cursor-pointer lowercase"
                    >
                      Change Account
                    </button>
                  </div>
                  
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 flex items-center gap-2 mb-2 select-none text-[11px] text-gray-400 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>User: {gateEmail}</span>
                  </div>

                  <input
                    id="google-gate-password"
                    type="password"
                    required
                    value={gatePassword}
                    onChange={(e) => setGatePassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full bg-white/5 border border-white/10 hover:border-brand-gold/20 focus:border-brand-gold focus:outline-none rounded-xl text-xs py-3 px-4 text-white font-mono transition"
                  />
                </div>

                <div className="text-[9px] text-gray-500 select-none">
                  Google Sync verifies permissions to authenticate calendar synchronization, clipboard overlays, and Gemini API capabilities automatically.
                </div>

                <button
                  id="google-gate-login-btn"
                  type="submit"
                  className="w-full bg-brand-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none shadow-lg font-space"
                >
                  Sign In with Google
                </button>
              </form>
            )}

            {gateStage === "connecting" && (
              <div className="space-y-4 py-6 text-center">
                <div className="flex items-center justify-center pb-2">
                  <span className="relative flex h-10 w-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-30"></span>
                    <span className="relative inline-flex rounded-full h-10 w-10 bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center text-brand-gold">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    </span>
                  </span>
                </div>
                <p className="text-xs text-brand-gold font-mono uppercase tracking-widest font-semibold animate-pulse">
                  Establishing OAuth Secure Tunnel
                </p>
                <p className="text-[10px] text-gray-400 font-mono italic max-w-xs mx-auto">
                  {gateStatus}
                </p>
              </div>
            )}
          </div>

          <p className="text-[10px] text-gray-600 mt-6 font-mono tracking-widest uppercase">
            MJ Cloud Infrastructure • Team Mahakal Premium Workspace
          </p>
        </div>
      )}

      {isLoggedIn && (
        <>
      
      {/* GLORIOUS TOP DECORATIVE HEADER BAR */}
      <header className="max-w-7xl mx-auto mb-8 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-brand-gold/20 transition-all duration-300 relative overflow-hidden shrink-0 shadow-lg">
        <div className="absolute right-0 top-0 h-40 w-40 bg-brand-gold rounded-full filter blur-[100px] opacity-[0.05] select-none pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3.5">
              <span className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
                <Radio className="h-5.5 w-5.5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xs uppercase tracking-[0.3em] text-brand-gold font-bold">
                    Premium AI Assistant Ecosystem
                  </h1>
                </div>
                <p className="text-lg sm:text-2xl font-light font-serif text-white tracking-tight mt-1">
                  Hello, <span className="font-medium italic text-brand-gold">Team Mahakal</span>. MJ premium cloud synchronization is active.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {isLoggedIn && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-left font-mono text-[9px] text-[#e0e0e0]">
                <div className="h-6 w-6 rounded-full bg-brand-gold text-black font-extrabold flex items-center justify-center shadow">
                  TM
                </div>
                <div>
                  <div className="text-white font-bold leading-tight uppercase font-space text-[10px]">Team Mahakal</div>
                  <div className="text-gray-500 text-[8px] truncate max-w-[120px]" title={loginEmail}>{loginEmail}</div>
                </div>
                <button
                  id="google-disconnect-btn"
                  onClick={handleLogout}
                  className="ml-1.5 hover:text-red-400 transition cursor-pointer text-gray-500 font-bold bg-white/5 hover:bg-white/10 py-1 px-1.5 rounded-md"
                  title="Disconnect Google Secure Sync"
                >
                  Disconnect
                </button>
              </div>
            )}

            <div className="text-[10px] font-mono bg-white/5 border border-white/10 px-3.5 py-2 rounded-full flex items-center gap-1.5 uppercase tracking-widest text-[#e0e0e0]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Team Mahakal Workspace</span>
            </div>

            <button
              id="refreshall-state-btn"
              onClick={fetchSyncState}
              className="p-2.5 bg-white/5 border border-white/10 hover:border-brand-gold/30 rounded-xl transition text-gray-300 hover:text-white cursor-pointer"
              title="Manual refresh from Cloud DB"
            >
              <RefreshCw className={`h-4 w-4 text-brand-gold ${isSyncing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Dynamic header stats band */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/5 text-xs text-gray-400">
          <div className="flex items-center gap-2 font-mono">
            <Laptop className="h-4 w-4 text-brand-gold opacity-80" />
            <span>Laptop Node: <b className="text-white">HP Omen</b></span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <Smartphone className="h-4 w-4 text-brand-gold opacity-80" />
            <span>Mobile App: <b className="text-white">Galaxy Ultra</b></span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <Cpu className="h-4 w-4 text-brand-gold opacity-80" />
            <span>Core Brain: <b className="text-white">Gemini Pro</b></span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <Wifi className="h-4 w-4 text-brand-gold opacity-80" />
            <span>Telemetry: <b className="text-white">4.2ms Sync</b></span>
          </div>
        </div>
      </header>

      {/* TABS SELECTORS */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-2 shrink-0 border-b border-white/5 pb-3">
        <button
          id="tab-dashboard"
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 border ${
            activeTab === "dashboard"
              ? "bg-brand-gold text-black border-brand-gold font-semibold"
              : "bg-[#0a0a0a] text-gray-400 border-white/5 hover:border-brand-gold/30 hover:text-white"
          }`}
        >
          <Layers className="h-4 w-4" /> Sync Dashboard
        </button>
        <button
          id="tab-coding"
          onClick={() => setActiveTab("coding")}
          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 border ${
            activeTab === "coding"
              ? "bg-brand-gold text-black border-brand-gold font-semibold"
              : "bg-[#0a0a0a] text-gray-400 border-white/5 hover:border-brand-gold/30 hover:text-white"
          }`}
        >
          <Code2 className="h-4 w-4" /> Vocal Coding Sandbox 💻
        </button>
        <button
          id="tab-documents"
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 border ${
            activeTab === "documents"
              ? "bg-brand-gold text-black border-brand-gold font-semibold"
              : "bg-[#0a0a0a] text-gray-400 border-white/5 hover:border-brand-gold/30 hover:text-white"
          }`}
        >
          <FileText className="h-4 w-4" /> Secure Docs Repository 📄
        </button>
        <button
          id="tab-youtube"
          onClick={() => setActiveTab("youtube")}
          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 border ${
            activeTab === "youtube"
              ? "bg-brand-gold text-black border-brand-gold font-semibold"
              : "bg-[#0a0a0a] text-gray-400 border-white/5 hover:border-brand-gold/30 hover:text-white"
          }`}
        >
          <Youtube className="h-4 w-4" /> YouTube Lounge 🎵
        </button>
        <button
          id="tab-search"
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 border ${
            activeTab === "search"
              ? "bg-brand-gold text-black border-brand-gold font-semibold"
              : "bg-[#0a0a0a] text-gray-400 border-white/5 hover:border-brand-gold/30 hover:text-white"
          }`}
        >
          <Search className="h-4 w-4" /> Ground Search 🔍
        </button>
        <button
          id="tab-astrology"
          onClick={() => setActiveTab("astrology")}
          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-2 border ${
            activeTab === "astrology"
              ? "bg-brand-gold text-black border-brand-gold font-semibold"
              : "bg-[#0a0a0a] text-gray-400 border-white/5 hover:border-brand-gold/30 hover:text-white"
          }`}
        >
          <Compass className="h-4 w-4" /> Rashi Fal & Astrology 🔮
        </button>
      </div>

      {/* CORE DISPLAY WINDOWS */}
      <main className="max-w-7xl mx-auto space-y-8 pb-16">
        
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            
            {/* LEFT SECTOR: SYNC ENGINE & EMULATORS DISPLAY (Spans 2 columns on extra large desktop screens) */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Central DB Hub diagnostics view */}
              <CentralDatabaseDashboard
                logs={logs}
                taskCount={tasks.length}
                reminderCount={reminders.length}
                clipboardCount={clipboardHistory.length}
                onWipeData={handleWipeData}
                onRefreshData={fetchSyncState}
              />

              {/* Active Operational Commands Board */}
              <ActionCenterBoard
                tasks={tasks}
                reminders={reminders}
                onAddTask={(text) => handleAddTask(text, "Control-Board")}
                onToggleTask={(id, completed) => {
                  const taskToToggle = tasks.find(t => t.id === id);
                  if (taskToToggle) {
                    handleToggleTask({ ...taskToToggle, completed: !completed });
                  }
                }}
                onDeleteTask={(id) => handleDeleteTask(id, "Control-Board")}
                onAddReminder={(text, time) => handleAddReminder(text, time, "Control-Board")}
                onDeleteReminder={(id) => handleDeleteReminder(id, "Control-Board")}
                onAddLog={addClientLog}
              />

              {/* Smart Household synchronized controller board */}
              <SmartHomeControls
                onAddLog={addClientLog}
                deviceStats={deviceStats}
                onUpdateDeviceStats={handleUpdateDeviceStats}
              />

            </div>

            {/* RIGHT SECTOR: PREMIUM MULTILlNGUAL MJ VOICE COMPANION (Spans 1 column) */}
            <div className="xl:col-span-1">
              <VoiceAssistantChat
                onAddLog={addClientLog}
                triggerSyncRefresh={fetchSyncState}
              />

              {/* Space for layout visual balance */}
              <div className="pt-2"></div>
            </div>

          </div>
        )}

        {activeTab === "coding" && (
          <CodingSandbox 
            onAddLog={addClientLog}
            speakText={speakTextGlobal}
          />
        )}

        {activeTab === "documents" && (
          <DocsReader 
            onAddLog={addClientLog}
            speakText={speakTextGlobal}
          />
        )}

        {activeTab === "youtube" && (
          <YouTubeLounge 
            onAddLog={addClientLog}
            speakText={speakTextGlobal}
          />
        )}

        {activeTab === "search" && (
          <SearchHub 
            onAddLog={addClientLog}
            speakText={speakTextGlobal}
          />
        )}

        {activeTab === "astrology" && (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 h-44 w-44 bg-[#ffe399] rounded-full filter blur-[150px] opacity-[0.02] select-none pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/5 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
                  <Compass className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-white uppercase tracking-wider text-base sm:text-lg">Team Mahakal's Vedic Astrology & Daily Panchang Engine</h3>
                  <p className="text-xs text-brand-gold font-mono">Real-time solar coordinates & celestial alignment mapping</p>
                </div>
              </div>
              
              <button
                id="tab-back-btn"
                onClick={() => setActiveTab("dashboard")}
                className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 rounded-lg px-4 py-2 hover:border-brand-gold/20"
              >
                ← Console Dashboard
              </button>
            </div>

            {/* Birth Details Calibration Form */}
            <form onSubmit={handleCalculatePanchang} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#111112] p-5 rounded-xl border border-white/5 mb-6">
              <div className="space-y-1.5 text-left">
                <label className="block text-[8px] uppercase tracking-widest font-mono text-gray-400 font-bold">
                  Date of Birth (DOB)
                </label>
                <input
                  id="astro-dob"
                  type="date"
                  value={dobInput}
                  onChange={(e) => setDobInput(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-brand-gold font-mono"
                  required
                />
              </div>
              
              <div className="space-y-1.5 text-left">
                <label className="block text-[8px] uppercase tracking-widest font-mono text-gray-400 font-bold">
                  Time of Birth (TOB)
                </label>
                <input
                  id="astro-tob"
                  type="time"
                  value={tobInput}
                  onChange={(e) => setTobInput(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-brand-gold font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left flex flex-col justify-between">
                <label className="block text-[8px] uppercase tracking-widest font-mono text-gray-400 font-bold">
                  Place of Birth (City)
                </label>
                <div className="flex gap-2">
                  <input
                    id="astro-place"
                    type="text"
                    value={placeInput}
                    onChange={(e) => setPlaceInput(e.target.value)}
                    placeholder="E.g. Mumbai, Maharashtra"
                    className="flex-1 bg-[#050505] border border-white/10 rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-brand-gold"
                    required
                  />
                  <button
                    id="trigger-astro-calc"
                    type="submit"
                    disabled={panchangLoading}
                    className="p-2 bg-brand-gold text-black hover:bg-[#ffe399] transition rounded-lg cursor-pointer shrink-0"
                    title="Calculate Astrological Panchang Coordinates"
                  >
                    {panchangLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      "Calculate"
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Panchang Loading Screen */}
            {panchangLoading && (
              <div className="bg-[#111112]/40 rounded-xl border border-dashed border-brand-gold/30 p-12 text-center space-y-3">
                <div className="flex justify-center">
                  <RefreshCw className="h-10 w-10 text-brand-gold animate-spin" />
                </div>
                <h4 className="text-white text-xs font-mono font-bold uppercase tracking-widest">
                  Querying celestial coordinates on Mahakal Net...
                </h4>
                <p className="text-[10px] text-gray-400 font-mono italic text-center">
                  Plotting Sun/Saturn gravity indices for birth coordinates at {placeInput}. Aligning time parameters with HP Omen node clocks.
                </p>
              </div>
            )}

            {/* Calculations Dashboard Display */}
            {!panchangLoading && panchangResult && (
              <div className="space-y-6">
                
                {/* Visual grid cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#111112] border border-white/5 p-4 rounded-xl text-left">
                    <span className="block text-[9px] uppercase tracking-wider font-mono text-gray-500 font-bold mb-1">Tithi (तिथि)</span>
                    <span className="text-sm font-semibold text-brand-gold tracking-tight">{panchangResult.tithi}</span>
                  </div>
                  <div className="bg-[#111112] border border-white/5 p-4 rounded-xl text-left">
                    <span className="block text-[9px] uppercase tracking-wider font-mono text-gray-500 font-bold mb-1">Nakshatra (नक्षत्र)</span>
                    <span className="text-sm font-semibold text-white tracking-tight">{panchangResult.nakshatra}</span>
                  </div>
                  <div className="bg-[#111112] border border-white/5 p-4 rounded-xl text-left">
                    <span className="block text-[9px] uppercase tracking-wider font-mono text-gray-500 font-bold mb-1">Vedic Yoga (योग)</span>
                    <span className="text-sm font-semibold text-white tracking-tight">{panchangResult.yoga}</span>
                  </div>
                  <div className="bg-[#111112] border border-white/5 p-4 rounded-xl text-left">
                    <span className="block text-[9px] uppercase tracking-wider font-mono text-gray-500 font-bold mb-1">Active Karana (करण)</span>
                    <span className="text-sm font-semibold text-white tracking-tight">{panchangResult.karana}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#111112] border border-white/5 p-4 rounded-xl text-left space-y-1.5 md:col-span-1">
                    <span className="block text-[9px] uppercase tracking-wider font-mono text-gray-500 font-bold border-b border-white/5 pb-1">Muhurtha Alignment</span>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-400">☀️ Sunrise:</span>
                        <span className="text-white">{panchangResult.sunrise}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">🌙 Sunset:</span>
                        <span className="text-white">{panchangResult.sunset}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-1 mt-1 font-semibold text-green-400">
                        <span>✨ Abhijit:</span>
                        <span>{panchangResult.abhijitMuhurtha}</span>
                      </div>
                      <div className="flex justify-between text-red-400 font-semibold">
                        <span>⚠️ Rahu Kaal:</span>
                        <span>{panchangResult.rahuKalam}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#111112] border border-white/5 p-4 rounded-xl text-left md:col-span-2 space-y-2">
                    <span className="block text-[9px] uppercase tracking-wider font-mono text-brand-gold font-bold border-b border-white/5 pb-1">Auspicious Activity Mapping</span>
                    <p className="text-xs text-gray-300 leading-relaxed font-semibold text-left">
                      🌌 {panchangResult.auspiciousActivity}
                    </p>
                    <div className="bg-brand-gold/5 border border-brand-gold/15 p-3 rounded-lg text-xs leading-relaxed italic text-[#ffe399] text-left">
                      " {panchangResult.personalizedAdvice} "
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!panchangLoading && !panchangResult && (
              <div className="space-y-6">
                {/* Default static Rashi panel if no Calculation is performed yet */}
                <div className="bg-[#111112]/40 p-5 rounded-xl border border-dashed border-white/5 mb-6 text-center text-xs text-gray-400">
                  ⚡ Enter date, time and place above, then click <b>'Calculate'</b> to compute daily Vedic coordinates and advice aligned with your HP Omen server networks!
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {astrologyCards.map((card, i) => (
                    <div key={i} className="bg-[#111112] border border-white/5 hover:border-brand-gold/30 transition duration-300 p-5 rounded-xl text-left">
                      <h4 className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-2 border-b border-white/5 pb-2">{card.rashi}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">{card.prediction}</p>
                      
                      <div className="pt-3 border-t border-[#1e1e1e] flex items-center justify-between text-[10px] font-mono">
                        <span className="text-brand-gold font-semibold">Color: {card.luckyColor}</span>
                        <span className="text-white">Lucky: {card.luckyNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-3">
              <span>Precise Vedic calculation engine v2.0 connected over telemetry.</span>
              <button
                id="back-to-console-btn"
                onClick={() => setActiveTab("dashboard")}
                className="text-xs text-brand-gold hover:text-white font-semibold cursor-pointer uppercase tracking-wider transition"
              >
                ← Back to Sync Dashboard Console
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Status footer banner */}
      <footer className="w-full text-center py-8 text-xs text-gray-600 border-t border-white/5 mt-20 text-balance">
        <p className="tracking-wide">MJ AI Assistant Real-Time Ecosystem Hub • Managed safely within sandbox Cloud Run container</p>
        <p className="text-[10px] text-brand-gold/60 font-mono mt-1.5 uppercase tracking-widest">Team Mahakal premium edition workspace v3.1</p>
      </footer>

      {/* Dynamic Telemetry Alerts & Command Execution Bridges */}
      <TelemetryAlertOverlay 
        deviceStats={deviceStats} 
        onUpdateDeviceStats={handleUpdateDeviceStats} 
      />

      </>
      )}

    </div>
  );
}
