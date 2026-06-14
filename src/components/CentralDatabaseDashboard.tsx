import React, { useState } from "react";
import { SyncLog } from "../types";
import { 
  Database, 
  Activity, 
  RefreshCw, 
  Radio, 
  Globe, 
  Cpu, 
  Server, 
  HelpCircle,
  TrendingUp,
  AlertCircle,
  FileCode,
  CheckCircle2,
  ListTodo,
  Sparkles
} from "lucide-react";

interface CentralDatabaseDashboardProps {
  logs: SyncLog[];
  taskCount: number;
  reminderCount: number;
  clipboardCount: number;
  onWipeData: () => void;
  onRefreshData: () => void;
}

export default function CentralDatabaseDashboard({
  logs,
  taskCount,
  reminderCount,
  clipboardCount,
  onWipeData,
  onRefreshData
}: CentralDatabaseDashboardProps) {
  const [networkPing, setNetworkPing] = useState(14);
  const [syncStatus, setSyncStatus] = useState<"ok" | "syncing" | "error">("ok");
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  const simulateDiagnostics = () => {
    setSyncStatus("syncing");
    setTimeout(() => {
      setNetworkPing(Math.round(Math.random() * 8) + 8);
      setSyncStatus("ok");
      onRefreshData();
    }, 1200);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl hover:border-brand-gold/20 transition-all duration-300 relative overflow-hidden">
      
      {/* DB Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-white/5 mb-6 gap-3">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
            <Database className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-space font-bold text-white text-base sm:text-lg tracking-wider uppercase">MJ Neural Central Sync Database</h2>
              <span className={`h-2 w-2 rounded-full ${syncStatus === "ok" ? "bg-green-500 animate-pulse" : "bg-brand-gold animate-spin"}`}></span>
            </div>
            <p className="text-[11px] text-gray-400 font-serif italic">Secure real-time state sync engine in cloud run container</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="refresh-diagnostics-btn"
            onClick={simulateDiagnostics}
            className="text-[10px] uppercase tracking-wider bg-white/5 hover:border-brand-gold/30 text-[#e0e0e0] hover:text-white rounded-lg px-4.5 py-2 border border-white/10 font-bold transition cursor-pointer flex items-center gap-2"
            disabled={syncStatus === "syncing"}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncStatus === "syncing" ? "animate-spin text-brand-gold" : "text-brand-gold"}`} />
            <span>Diagnostic Check</span>
          </button>
        </div>
      </div>

      {/* Synchronized flow pipeline visualization (Blinking dots!) */}
      <div className="mb-6 bg-[#050505] p-5 rounded-xl border border-white/5">
        <h4 className="text-[9px] uppercase tracking-[0.2em] text-brand-gold opacity-80 font-bold mb-4">Live Central State Connection Pipeline</h4>
        
        <div className="flex flex-col md:flex-row items-center justify-around gap-4 md:gap-2">
          
          {/* Laptop Node */}
          <div className="flex flex-col items-center bg-[#111112] p-3 rounded-xl border border-white/5 w-full md:w-32 text-center text-xs">
            <span className="font-semibold text-white font-space mb-1">HP-Omen-Desktop</span>
            <span className="text-[9px] font-mono text-gray-500">Node HP-993</span>
            <span className="text-[9px] text-green-500 font-mono mt-1 font-semibold">● ACTIVE</span>
          </div>

          {/* Sync Line Left */}
          <div className="hidden md:flex flex-col items-center flex-1 relative px-2">
            <span className="text-[9px] text-brand-gold/60 font-mono uppercase tracking-wider mb-1">Copy-Sync</span>
            <div className="w-full bg-white/5 h-0.5 relative">
              <span className="absolute left-[30%] -top-1 block h-2.5 w-2.5 rounded-full bg-brand-gold animate-ping"></span>
            </div>
            <span className="text-[8px] text-brand-gold/80 font-mono mt-1">LATENCY: 0.08s</span>
          </div>

          {/* Cloud Database Hub */}
          <div className="flex flex-col items-center bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/20 w-full md:w-40 text-center text-xs">
            <Server className="h-4.5 w-4.5 text-brand-gold mb-1.5" />
            <span className="font-bold text-brand-gold font-space tracking-wider uppercase text-[11px]">Central Server</span>
            <span className="text-[8px] font-mono text-gray-500 mt-0.5">Express Shared Container</span>
            <span className="text-[9px] text-white font-semibold mt-1.5 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">{networkPing}ms Ping</span>
          </div>

          {/* Sync Line Right */}
          <div className="hidden md:flex flex-col items-center flex-1 relative px-2">
            <span className="text-[9px] text-brand-gold/60 font-mono uppercase tracking-wider mb-1">Replica</span>
            <div className="w-full bg-white/5 h-0.5 relative">
              <span className="absolute right-[30%] -top-1 block h-2.5 w-2.5 rounded-full bg-brand-gold animate-ping"></span>
            </div>
            <span className="text-[8px] text-brand-gold/80 font-mono mt-1">LATENCY: 0.12s</span>
          </div>

          {/* Mobile Node */}
          <div className="flex flex-col items-center bg-[#111112] p-3 rounded-xl border border-white/5 w-full md:w-32 text-center text-xs">
            <span className="font-semibold text-white font-space mb-1">Galaxy-Mobile</span>
            <span className="text-[9px] font-mono text-gray-500">ANDROID-883</span>
            <span className="text-[9px] text-green-500 font-mono mt-1 font-semibold">● ACTIVE</span>
          </div>

        </div>
      </div>

      {/* Database Diagnostic statistics bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111112] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block">Tasks</span>
            <span className="text-2xl font-light text-white mt-1 block">{taskCount}</span>
          </div>
          <ListTodo className="h-5 w-5 text-brand-gold shrink-0 opacity-40" />
        </div>
        <div className="bg-[#111112] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block">Alerts</span>
            <span className="text-2xl font-light text-white mt-1 block">{reminderCount}</span>
          </div>
          <AlertCircle className="h-5 w-5 text-brand-gold shrink-0 opacity-40" />
        </div>
        <div className="bg-[#111112] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block">Clips</span>
            <span className="text-2xl font-light text-white mt-1 block">{clipboardCount}</span>
          </div>
          <FileCode className="h-5 w-5 text-brand-gold shrink-0 opacity-40" />
        </div>
        <div className="bg-[#111112] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest block">Ecosystem</span>
            <span className="text-xs font-bold text-green-500 mt-2 block flex items-center gap-1 uppercase tracking-wide">
              <CheckCircle2 className="h-3.5 w-3.5" /> SECURED
            </span>
          </div>
          <Globe className="h-5 w-5 text-green-500 shrink-0 opacity-30" />
        </div>
      </div>

      {/* Sync Log Feed */}
      <div className="bg-[#050505] p-5 rounded-xl border border-white/5">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h4 className="text-xs font-bold text-white font-space tracking-widest uppercase flex items-center gap-2">
            <Radio className="h-4 w-4 text-brand-gold animate-pulse" /> Live Central Sync Feed
          </h4>
          <span className="text-[9px] text-brand-gold/60 font-mono uppercase tracking-wider">Cloud stream polling active</span>
        </div>

        {/* Logs visual logs list */}
        <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
          {logs.map((log) => {
            let typeColor = "text-brand-gold bg-brand-gold/10 border-brand-gold/20";
            if (log.type === "system") typeColor = "text-green-400 bg-green-500/10 border-green-500/10";
            if (log.type === "task") typeColor = "text-brand-gold bg-brand-gold/10 border-brand-gold/10";
            if (log.type === "reminder") typeColor = "text-white bg-white/5 border-white/10";
            if (log.type === "voice") typeColor = "text-brand-gold bg-brand-gold/15 border-brand-gold/25";

            return (
              <div
                id={`synclog-${log.id}`}
                key={log.id}
                className="flex items-start justify-between p-2.5 rounded-lg bg-[#111112] border border-white/5 hover:border-brand-gold/20 transition flex-row text-xs gap-3 font-mono"
              >
                <div className="flex items-start gap-2.5 truncate">
                  <span className={`text-[8px] tracking-widest uppercase font-bold border px-2 py-0.5 rounded shrink-0 ${typeColor}`}>
                    {log.type}
                  </span>
                  <p className="text-gray-300 truncate font-mono text-[11px] mt-0.5">{log.text}</p>
                </div>
                
                <div className="flex items-center gap-2 text-[9px] text-gray-500 shrink-0 select-none">
                  <span className="text-brand-gold/70">{log.deviceSource}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Troubleshooting options */}
      <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
        <button
          id="toggle-trouble-btn"
          onClick={() => setShowTroubleshoot(!showTroubleshoot)}
          className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-brand-gold flex items-center gap-1.5 cursor-pointer transition"
        >
          <HelpCircle className="h-3.5 w-3.5" /> Advanced Diagnostics & Reset
        </button>
        <span className="text-[10px] text-gray-500 font-mono">MJ Core Sync Framework v3.1-express</span>
      </div>

      {showTroubleshoot && (
        <div className="mt-4 p-5 bg-[#141416] rounded-xl border border-brand-gold/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h5 className="text-xs font-bold text-brand-gold flex items-center gap-1 font-space uppercase tracking-wider">
              <AlertCircle className="h-4 w-4" /> Reset central memory database cache?
            </h5>
            <p className="text-[11px] text-gray-400 mt-1 max-w-md">Wiping the database restores tasks, clipboard history and reminders back to standard seed templates.</p>
          </div>
          <button
            id="wipe-database-btn"
            onClick={() => {
              onWipeData();
              setShowTroubleshoot(false);
            }}
            className="bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-black border border-brand-gold/30 hover:border-transparent text-xs font-bold uppercase tracking-widest py-2 px-5 rounded-lg cursor-pointer shrink-0 transition"
          >
            Wipe & Restore DB Seed
          </button>
        </div>
      )}

    </div>
  );
}
