import React, { useState } from "react";
import { Task, Reminder, ClipboardClip } from "../types";
import { 
  Laptop, 
  Smartphone, 
  Wifi, 
  Thermometer, 
  Cpu, 
  Battery, 
  Clipboard, 
  CheckSquare, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Hourglass, 
  VolumeX, 
  Volume2, 
  Moon, 
  Sun, 
  Camera, 
  Activity,
  Maximize2,
  Lock,
  Power,
  Shield,
  FileText
} from "lucide-react";

interface DeviceSimulatorProps {
  tasks: Task[];
  reminders: Reminder[];
  clipboard: ClipboardClip;
  clipboardHistory: ClipboardClip[];
  onAddTask: (text: string, source: string) => void;
  onToggleTask: (task: Task) => void;
  onDeleteTask: (id: string, source: string) => void;
  onSetClipboard: (text: string, source: string) => void;
  onAddReminder: (text: string, time: string, source: string) => void;
  onDeleteReminder: (id: string, source: string) => void;
  deviceStats?: any;
  onUpdateDeviceStats?: (newStats: any) => void;
  onAddLog?: (text: string, type: "system" | "task" | "clipboard" | "reminder" | "voice", source: string) => void;
}

export default function DeviceSimulator({
  tasks,
  reminders,
  clipboard,
  clipboardHistory,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSetClipboard,
  onAddReminder,
  onDeleteReminder,
  deviceStats,
  onUpdateDeviceStats,
  onAddLog
}: DeviceSimulatorProps) {
  // Desktop Local states
  const [desktopTaskText, setDesktopTaskText] = useState("");
  const [superState, setSuperState] = useState<"idle" | "overclocking" | "supercharged">("idle");
  const [superLogs, setSuperLogs] = useState<string[]>([]);

  const handleSupercharge = () => {
    setSuperState("overclocking");
    setSuperLogs(["LAUNCHING SECURE HP KERNEL SYNAPSE OVERCLOCK..."]);
    
    setTimeout(() => {
      setSuperLogs(prev => [...prev, "CONNECTING HIGH-FREQUENCY OMEN TELEMETRY BUS... [OK]"]);
    }, 600);
    setTimeout(() => {
      setSuperLogs(prev => [...prev, "DISPATCHING MJ-CORE MASSIVE THREAD INJECTORS... [OK]"]);
    }, 1200);
    setTimeout(() => {
      setSuperLogs(prev => [...prev, "PURGING BACKGROUND MEMORY LEAKS AND SYS CACHING... [OK]"]);
    }, 1800);
    setTimeout(() => {
      setSuperLogs(prev => [...prev, "BOOSTING VALKYRIE SHUTDOWN THERMALS TO EXTREME PERFORMANCE... [OK]"]);
    }, 2400);

    setTimeout(() => {
      setSuperState("supercharged");
      onUpdateDeviceStats?.({
        desktopTemp: 34,
        ramUsage: 5.2,
        desktopAppsOpened: ["Command Prompt", "MJ Core Engine v4", "Intel Overdriver Extreme"]
      });
      onAddLog?.("SUPER LAPTOP ACTIVATED: Overclocking enabled, RAM purged, simulated temperature now at 34°C!", "system", "Supercharger-Engine");
    }, 3200);
  };
  const [desktopClipInput, setDesktopClipInput] = useState("");
  const [desktopReminderText, setDesktopReminderText] = useState("");
  const [desktopReminderTime, setDesktopReminderTime] = useState("10:00");
  const [desktopPowerState, setDesktopPowerState] = useState<"on" | "off" | "restarting">("on");
  const [desktopTemp, setDesktopTemp] = useState(42);
  const [desktopMute, setDesktopMute] = useState(false);
  const [desktopLightsColor, setDesktopLightsColor] = useState("cyan");

  // Mobile Local states
  const [mobileTaskText, setMobileTaskText] = useState("");
  const [mobileClipInput, setMobileClipInput] = useState("");
  const [mobileClipPasteResult, setMobileClipPasteResult] = useState("");
  const [mobileReminderText, setMobileReminderText] = useState("");
  const [mobileReminderTime, setMobileReminderTime] = useState("18:30");
  const [mobileBatterySaver, setMobileBatterySaver] = useState(false);
  const [mobileLockState, setMobileLockState] = useState(false);
  const [mobileDnd, setMobileDnd] = useState(false);
  const [screenshotNotification, setScreenshotNotification] = useState<string | null>(null);

  // Synchronize state when central backend deviceStats is pushed down
  React.useEffect(() => {
    if (deviceStats) {
      if (deviceStats.desktopPowerState) {
        setDesktopPowerState(deviceStats.desktopPowerState);
      }
      if (deviceStats.desktopTemp !== undefined) {
        setDesktopTemp(deviceStats.desktopTemp);
      }
      if (deviceStats.desktopMute !== undefined) {
        setDesktopMute(deviceStats.desktopMute);
      }
      if (deviceStats.desktopLightsColor) {
        setDesktopLightsColor(deviceStats.desktopLightsColor);
      }
      if (deviceStats.mobileBatterySaver !== undefined) {
        setMobileBatterySaver(deviceStats.mobileBatterySaver);
      }
      if (deviceStats.mobileLockState !== undefined) {
        setMobileLockState(deviceStats.mobileLockState);
      }
    }
  }, [deviceStats]);

  // Trigger Dummy Actions
  const handleDesktopPower = (action: "shutdown" | "restart") => {
    if (action === "shutdown") {
      setDesktopPowerState("off");
      onUpdateDeviceStats?.({ desktopPowerState: "off" });
      setTimeout(() => {
        setDesktopPowerState("on");
        onUpdateDeviceStats?.({ desktopPowerState: "on" });
      }, 5000); // recover
    } else {
      setDesktopPowerState("restarting");
      onUpdateDeviceStats?.({ desktopPowerState: "restarting" });
      setTimeout(() => {
        setDesktopPowerState("on");
        onUpdateDeviceStats?.({ desktopPowerState: "on" });
      }, 2500);
    }
  };

  const handleScreenshot = (device: string) => {
    setScreenshotNotification(`${device}: Screenshot captured to synced cloud backup! 📸`);
    setTimeout(() => setScreenshotNotification(null), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 💻 HP OMEN DESKTOP SIMULATOR */}
      <div id="desktop-simulator-node" className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative flex flex-col hover:border-brand-gold/20 transition-all duration-300 shadow-xl">
        
        {/* Hardware Frame Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg border ${desktopPowerState === "on" ? "bg-brand-gold/10 text-brand-gold border-brand-gold/20" : "bg-red-950/20 text-red-500 border-red-900/30"}`}>
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-space font-semibold text-white text-sm tracking-wide">HP-Omen-Desktop</span>
                <span className={`h-2 w-2 rounded-full ${desktopPowerState === "on" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
              </div>
              <p className="text-[10px] font-mono text-gray-500">Node ID: OMEN-HP-9932X_DESKTOP</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              id="desktop-power-btn"
              onClick={() => handleDesktopPower(desktopPowerState === "on" ? "shutdown" : "restart")}
              className="p-1.5 bg-white/5 border border-white/10 hover:border-brand-gold/30 hover:text-red-400 cursor-pointer rounded-lg text-gray-400 transition"
              title="Power Controls"
            >
              <Power className="h-4 w-4" />
            </button>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 block uppercase font-mono">Telemetry</span>
              <span className="text-xs font-semibold text-brand-gold font-mono">4.2ms Sync PING</span>
            </div>
          </div>
        </div>

        {/* Offline State */}
        {desktopPowerState !== "on" && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center bg-[#050505] rounded-xl border border-dashed border-white/5">
            {desktopPowerState === "off" ? (
              <>
                <Power className="h-12 w-12 text-red-500 animate-pulse mb-3" />
                <h4 className="text-white font-semibold">Desktop offline (Shutting Down)</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">MJ is holding the offline cloud queue. Simulated boot up sequence initiated in 5 seconds...</p>
              </>
            ) : (
              <>
                <RefreshCw className="h-12 w-12 text-brand-gold animate-spin mb-3" />
                <h4 className="text-white font-semibold">Omen UEFI System Restarting...</h4>
                <p className="text-xs text-brand-gold mt-1 font-mono">Resetting system state, sync cache preserved.</p>
              </>
            )}
          </div>
        )}

        {desktopPowerState === "on" && (
          <div className="flex flex-col gap-6 flex-1">
            
            {/* Desktop Dashboard - Top Status Ribbon */}
            <div className="grid grid-cols-3 gap-3 bg-[#111112] p-3 rounded-xl border border-white/5 shrink-0 shadow-inner">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono tracking-wider flex items-center gap-1 uppercase font-bold">
                  <Thermometer className="h-3 w-3 text-brand-gold" /> PC TEMP
                </span>
                <span className="text-xs font-semibold text-white mt-0.5">{desktopTemp}°C (Normal)</span>
                <div className="w-full bg-white/5 rounded-full h-1 mt-1">
                  <div className="bg-brand-gold h-1 rounded-full" style={{ width: `${(desktopTemp/100)*100}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono tracking-wider flex items-center gap-1 uppercase font-bold">
                  <Cpu className="h-3 w-3 text-brand-gold" /> RAM USAGE
                </span>
                <span className="text-xs font-semibold text-white mt-0.5">
                  {deviceStats?.ramUsage !== undefined ? (deviceStats.ramUsage > 32 ? `${deviceStats.ramUsage.toFixed(1)}%` : `${deviceStats.ramUsage.toFixed(1)} GB`) : "14.2 / 32 GB"}
                </span>
                <div className="w-full bg-white/5 rounded-full h-1 mt-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      (deviceStats?.ramUsage !== undefined && (deviceStats.ramUsage > 90 || (deviceStats.ramUsage <= 32 && (deviceStats.ramUsage / 32) * 100 > 90))) 
                        ? "bg-red-500 animate-pulse" 
                        : "bg-brand-gold"
                    }`}
                    style={{ 
                      width: `${
                        deviceStats?.ramUsage !== undefined 
                          ? (deviceStats.ramUsage > 32 
                              ? Math.min(deviceStats.ramUsage, 100) 
                              : Math.min((deviceStats.ramUsage / 32) * 100, 100)) 
                          : 44
                      }%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] text-gray-500 font-mono tracking-wider flex items-center gap-1 uppercase font-bold">
                  <Wifi className="h-3 w-3 text-green-500" /> NETWORK
                </span>
                <span className="text-xs font-semibold text-green-500 mt-0.5">Connected</span>
                <span className="text-[9px] text-gray-500 truncate mt-0.5 font-mono">Secured LAN</span>
              </div>
            </div>

            {/* CLIPBOARD SYNCHRONIZER ELEMENT */}
            <div id="desktop-clipboard-element" className="bg-[#111112] border border-white/5 p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-white font-space uppercase tracking-wider flex items-center gap-1.5">
                  <Clipboard className="h-4 w-4 text-brand-gold" /> Laptop Clipboard (Copy text here)
                </h4>
                <span className="text-[9px] text-brand-gold font-mono">Binds globally</span>
              </div>

              {/* Active display */}
              <div className="bg-[#050505] p-2.5 rounded-lg border border-white/5 flex items-center justify-between gap-2 mb-3">
                <div className="truncate text-xs font-mono text-gray-300">
                  <span className="text-brand-gold mr-1">Live Clip:</span> "{clipboard.text}"
                </div>
                <span className="shrink-0 text-[9px] uppercase tracking-wider bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded font-mono font-bold">
                  {clipboard.deviceSource === "Desktop-HP" ? "Local" : "Synced!"}
                </span>
              </div>

              {/* Copy control form */}
              <div className="flex gap-2">
                <input
                  id="desktop-clip-input"
                  type="text"
                  value={desktopClipInput}
                  onChange={(e) => setDesktopClipInput(e.target.value)}
                  placeholder="Paste/Type text and copy on Desktop..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg text-xs py-1.5 px-3 text-white focus:outline-none focus:border-brand-gold placeholder-gray-600 transition"
                />
                <button
                  id="desktop-copy-btn"
                  onClick={() => {
                    if (desktopClipInput.trim()) {
                      onSetClipboard(desktopClipInput, "Desktop-HP");
                      setDesktopClipInput("");
                    }
                  }}
                  className="bg-brand-gold text-black hover:bg-gold-light text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
                >
                  Copy Text
                </button>
              </div>

              {/* Clipboard history quick-tabs */}
              <div className="mt-3.5 flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">History Links:</span>
                {clipboardHistory.slice(0, 3).map((clip) => (
                  <button
                    id={`desktop-hist-clip-${clip.id}`}
                    key={clip.id}
                    onClick={() => onSetClipboard(clip.text, "Desktop-HP")}
                    className="text-[9px] bg-white/5 border border-white/10 text-gray-300 rounded px-2 py-1 truncate max-w-[120px] hover:border-brand-gold/30 hover:text-brand-gold transition"
                    title={clip.text}
                  >
                    {clip.text}
                  </button>
                ))}
              </div>
            </div>

            {/* SHARED LOGICAL TASKS LIST */}
            <div className="flex-1 border border-white/5 bg-[#111112]/50 p-4 rounded-xl flex flex-col min-h-[160px] shadow-md">
              <h4 className="text-xs font-bold text-white font-space uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-brand-gold" /> Shared Active Task Sync
              </h4>

              {/* Add task form */}
              <div className="flex gap-2 mb-3 shrink-0">
                <input
                  id="desktop-task-input"
                  type="text"
                  value={desktopTaskText}
                  onChange={(e) => setDesktopTaskText(e.target.value)}
                  placeholder="Create task on Desktop..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg text-xs py-1.5 px-3 text-white focus:outline-none focus:border-brand-gold placeholder-gray-600 transition"
                />
                <button
                  id="desktop-add-task-btn"
                  onClick={() => {
                    if (desktopTaskText.trim()) {
                      onAddTask(desktopTaskText, "Desktop-HP");
                      setDesktopTaskText("");
                    }
                  }}
                  className="p-1.5 bg-brand-gold text-black hover:bg-gold-light rounded-lg transition cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto max-h-[150px] space-y-2 custom-scrollbar pr-1">
                {tasks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-600">No synchronized tasks. Create one!</div>
                ) : (
                  tasks.map((task) => (
                    <div
                      id={`desktop-task-${task.id}`}
                      key={task.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:border-brand-gold/15 transition"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          id={`desktop-task-check-${task.id}`}
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleTask(task)}
                          className="rounded text-brand-gold focus:ring-brand-gold h-4 border-white/10 bg-[#050505] cursor-pointer"
                        />
                        <span className={`text-xs truncate ${task.completed ? "line-through text-gray-500" : "text-gray-200"}`}>
                          {task.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[8px] uppercase tracking-wider bg-white/5 px-2 py-0.5 text-gray-400 border border-white/10 rounded font-mono">
                          {task.deviceSource === "Desktop-HP" ? "HP" : "Android"}
                        </span>
                        <button
                          id={`desktop-task-del-${task.id}`}
                          onClick={() => onDeleteTask(task.id, "Desktop-HP")}
                          className="text-gray-500 hover:text-red-400 p-1 rounded transition cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* REMINDERS PANEL */}
            <div className="bg-[#111112]/50 border border-white/5 p-4 rounded-xl shrink-0">
              <h4 className="text-xs font-bold text-white font-space uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Hourglass className="h-4 w-4 text-brand-gold" /> Create Reminders (Real-Time Sync)
              </h4>

              <div className="flex gap-2 mb-3">
                <input
                  id="desktop-rem-input"
                  type="text"
                  value={desktopReminderText}
                  onChange={(e) => setDesktopReminderText(e.target.value)}
                  placeholder="Remind me to..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg text-xs py-1.5 px-3 text-white focus:outline-none focus:border-brand-gold placeholder-gray-600 transition"
                />
                <input
                  id="desktop-rem-time"
                  type="time"
                  value={desktopReminderTime}
                  onChange={(e) => setDesktopReminderTime(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg text-xs py-1 px-1.5 text-white text-center focus:outline-none select-none max-w-[80px]"
                />
                <button
                  id="desktop-add-rem-btn"
                  onClick={() => {
                    if (desktopReminderText.trim()) {
                      onAddReminder(desktopReminderText, desktopReminderTime, "Desktop-HP");
                      setDesktopReminderText("");
                    }
                  }}
                  className="bg-brand-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg transition cursor-pointer shrink-0"
                >
                  Set Alarm
                </button>
              </div>

              {/* Reminders List */}
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto custom-scrollbar">
                {reminders.map((rem) => (
                  <div
                    id={`desktop-rem-${rem.id}`}
                    key={rem.id}
                    className="flex items-center justify-between px-2.5 py-1.5 bg-[#050505] border border-white/5 rounded-lg text-xs text-gray-300"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-1.5 py-0.5 rounded shrink-0">
                        {rem.time}
                      </span>
                      <span className="truncate">{rem.text}</span>
                    </div>
                    <button
                      id={`desktop-rem-del-${rem.id}`}
                      onClick={() => onDeleteReminder(rem.id, "Desktop-HP")}
                      className="text-gray-500 hover:text-red-400 p-0.5 rounded cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Actions and Settings Menu bar */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 justify-between items-center text-xs text-gray-500 transition-all">
              <div className="flex items-center gap-2">
                <button
                  id="desktop-sound-btn"
                  onClick={() => setDesktopMute(!desktopMute)}
                  className="p-1 hover:bg-white/5 hover:text-white rounded cursor-pointer"
                  title="Toggle PC sound levels"
                >
                  {desktopMute ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4 text-brand-gold" />}
                </button>
                <button
                  id="desktop-screenshot-btn"
                  onClick={() => handleScreenshot("Desktop-HP")}
                  className="p-1 hover:bg-white/5 hover:text-white rounded cursor-pointer bg-white/5 border border-white/10"
                  title="Capture PC screen screenshot"
                >
                  <Camera className="h-4 w-4 text-brand-gold" />
                </button>
                <button
                  id="desktop-temp-boost"
                  onClick={() => {
                    const nextTemp = desktopTemp > 50 ? 42 : Math.floor(Math.random() * 25) + 50;
                    setDesktopTemp(nextTemp);
                  }}
                  className="text-[9px] bg-white/5 border border-white/10 hover:border-brand-gold/30 text-gray-300 rounded px-2.5 py-1 font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1"
                >
                  <Activity className="h-3 w-3 text-brand-gold animate-pulse" /> Fan Boost
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="font-mono text-gray-500">Chroma:</span>
                {["cyan", "purple", "gold"].map((col) => (
                  <button
                    id={`desktop-kb-color-${col}`}
                    key={col}
                    onClick={() => setDesktopLightsColor(col)}
                    className={`h-2.5 w-2.5 rounded-full border border-gray-950 transition-all ${
                      col === "cyan" ? "bg-cyan-500" : col === "purple" ? "bg-purple-500" : "bg-[#c5a36c]"
                    } ${desktopLightsColor === col ? "scale-125 ring-1 ring-brand-gold" : "opacity-50"}`}
                  />
                ))}
              </div>
            </div>

            {/* 🌪️ SUPER LAPTOP OVERCLOCK ENGINE */}
            <div id="super-laptop-container" className="bg-[#111112] border border-brand-gold/10 p-4 rounded-xl relative overflow-hidden mt-3 shadow-inner">
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-ping"></span>
                  <h4 className="text-xs font-black text-white font-space uppercase tracking-widest">
                    MJ Super Laptop System
                  </h4>
                </div>
                <span className="text-[9px] uppercase tracking-wider text-brand-gold font-mono font-bold">
                  OMEN-HP Mode
                </span>
              </div>

              {superState === "idle" && (
                <div className="space-y-3">
                  <p className="text-[11px] text-gray-400 font-serif italic leading-relaxed">
                    "Elevate your HP Omen workspace into a Supercharged machine. Trigger kernel overclock simulation, sweep RAM bloat-leaks, and calibrate internal coolers dynamically."
                  </p>
                  <button
                    id="trigger-supercharge-btn"
                    onClick={handleSupercharge}
                    className="w-full bg-brand-gold text-black hover:bg-[#ffe399] py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                  >
                    🚀 Overclock to Super Laptop
                  </button>
                </div>
              )}

              {superState === "overclocking" && (
                <div className="bg-black p-3 rounded-lg border border-brand-gold/20 font-mono text-[10px] space-y-1 text-brand-gold">
                  {superLogs.map((log, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="animate-pulse">▶</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div className="pt-2 text-center text-[9px] text-gray-400 flex items-center justify-center gap-2">
                    <span className="animate-spin h-3.5 w-3.5 border border-brand-gold border-t-transparent rounded-full"></span>
                    <span>Synchronizing hypervisors...</span>
                  </div>
                </div>
              )}

              {superState === "supercharged" && (
                <div className="space-y-3">
                  <div className="bg-brand-gold/5 border border-brand-gold/20 p-3 rounded-lg text-center font-mono space-y-1">
                    <div className="text-brand-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
                      <span>⚡ SUPER LAPTOP IN FULL PLAY ⚡</span>
                    </div>
                    <p className="text-[10px] text-gray-300 mt-1">
                      CPU Boosted • Thermal Limit: <b className="text-green-400">34°C Cool</b> • Ram purged: <b className="text-white">5.2GB Stable</b>
                    </p>
                  </div>
                  <button
                    id="reset-supercharge-btn"
                    onClick={() => {
                      setSuperState("idle");
                      onUpdateDeviceStats?.({
                        desktopTemp: 44,
                        ramUsage: 14.2,
                        desktopAppsOpened: ["Command Prompt"]
                      });
                      onAddLog?.("HP Omen system set back to standard eco balance mode.", "system", "Supercharger-Engine");
                    }}
                    className="w-full bg-white/5 border border-white/10 hover:border-brand-gold/30 text-gray-300 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition cursor-pointer"
                  >
                    Reset Optimization State
                  </button>
                </div>
              )}

              <p className="text-[9px] text-gray-500 mt-2 text-left leading-relaxed">
                ⚠️ browser isolation blocks actual third-party local hardware thread override, but MJ has deployed full software-kernel overclock simulation to maximize synchronization bandwidth!
              </p>
            </div>

          </div>
        )}
      </div>

      {/* 📱 UNIFIED MOBILE SMARTPHONE SIMULATOR */}
      <div id="mobile-simulator-node" className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 relative flex flex-col hover:border-brand-gold/20 transition-all duration-300 max-w-[450px] mx-auto w-full shadow-2xl">
        
        {/* Smartphone Camera Notch Frame */}
        <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 h-4 w-28 bg-[#050505] rounded-full flex items-center justify-around px-2 border border-white/10 z-30 shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-brand-gold/50 ring-1 ring-brand-gold/80"></div>
          <div className="h-1 w-10 rounded-full bg-white/5"></div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-4 pt-1 pb-3 text-[10px] text-gray-500 font-mono select-none shrink-0 border-b border-white/5 mb-3 z-10 mt-1">
          <span>09:41 AM (Soni Net)</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3 w-3 text-brand-gold" />
            <span className="font-space">5G Active</span>
            <div className="flex items-center gap-1">
              <span className={mobileBatterySaver ? "text-amber-500 font-bold" : (deviceStats?.batteryLevel !== undefined && deviceStats.batteryLevel < 15) ? "text-red-500 font-extrabold animate-pulse" : "text-brand-gold font-bold"}>
                {mobileBatterySaver ? "LPM" : `${deviceStats?.batteryLevel !== undefined ? deviceStats.batteryLevel : 88}%`}
              </span>
              <Battery className={`h-3.5 w-3.5 transition-all ${mobileBatterySaver ? "text-amber-500 font-bold font-mono" : (deviceStats?.batteryLevel !== undefined && deviceStats.batteryLevel < 15) ? "text-red-500 animate-bounce" : "text-brand-gold"}`} />
            </div>
          </div>
        </div>

        {/* Lock Screen simulation */}
        {mobileLockState && (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center bg-[#050505] rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="p-4 bg-brand-gold/10 rounded-full border border-brand-gold/20 mb-4 animate-bounce">
              <Lock className="h-8 w-8 text-brand-gold" />
            </div>
            <h4 className="text-white font-space font-semibold text-lg tracking-wide uppercase">Device Locked</h4>
            <p className="text-xs text-gray-500 mt-1.5 max-w-[240px]">Biometric verification required. Touch button below to access premium workspace.</p>
            
            <button
              id="mobile-unlock-btn"
              onClick={() => setMobileLockState(false)}
              className="mt-6 text-xs bg-brand-gold hover:bg-gold-light text-black font-bold uppercase tracking-widest py-2.5 px-6 rounded-xl border border-brand-gold cursor-pointer transition shadow-lg"
            >
              Touch unlock sensor
            </button>
          </div>
        )}

        {!mobileLockState && (
          <div className="flex flex-col gap-5 flex-1 w-full text-xs">
            
            {/* Device Name and Quick Settings */}
            <div className="flex justify-between items-center bg-[#111112] p-2.5 rounded-xl border border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4.5 w-4.5 text-brand-gold" />
                <div>
                  <span className="font-semibold text-white block text-[11px]">Galaxy OneUI Terminal</span>
                  <span className="text-[9px] text-gray-500 font-mono">Synced • Raj Soni</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="mobile-saver-btn"
                  onClick={() => {
                    setMobileBatterySaver(!mobileBatterySaver);
                    onAddLog?.(`Sync: Mobile battery saver toggled (${!mobileBatterySaver ? "Active" : "Inactive"})`, "system", "Mobile-Android");
                  }}
                  className={`p-1 rounded cursor-pointer transition ${mobileBatterySaver ? "bg-amber-950/40 border border-amber-800 text-amber-500 font-bold" : "bg-white/5 text-gray-450 border border-white/10"}`}
                  title="Toggle Battery Saver"
                >
                  <Battery className="h-3.5 w-3.5" />
                </button>
                <button
                  id="mobile-lock-btn"
                  onClick={() => setMobileLockState(true)}
                  className="p-1 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded cursor-pointer"
                  title="Lock Mobile"
                >
                  <Lock className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* SHARED CLIPBOARD DEMONSTRATOR FLUID EXPLAINED */}
            <div id="mobile-clipboard-element" className="bg-[#111112] border border-white/5 p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-white font-space uppercase tracking-wider flex items-center gap-1.5">
                  <Clipboard className="h-4 w-4 text-brand-gold" /> Shared Clip Sync
                </h4>
                <span className="text-[9px] text-brand-gold font-mono uppercase tracking-widest bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 font-bold">Cloud Live</span>
              </div>

              {/* Live server copy */}
              <div className="bg-[#050505] p-2.5 rounded-lg border border-white/5 flex flex-col gap-1.5 mb-2.5">
                <span className="text-[8px] text-brand-gold/80 uppercase tracking-widest font-bold font-mono">Latest Central Server Clip DB:</span>
                <span id="shared-text-read" className="text-xs text-gray-100 font-mono select-all bg-white/5 border border-white/5 p-1.5 rounded truncate">
                  {clipboard.text}
                </span>
                <span className="text-[9px] text-gray-500 font-mono italic">Source Node: <b className="text-brand-gold">{clipboard.deviceSource}</b></span>
              </div>

              {/* EXTREMELY INTERACTIVE PASTE DEMO */}
              <div className="space-y-2 mt-3 p-3 bg-[#050505] rounded-lg border border-white/5">
                <p className="text-[10px] text-gray-500 font-serif leading-relaxed italic">
                  Take active clipboard copied on HP Laptop system memory. Click paste to sync down:
                </p>
                
                <div className="flex gap-1.5">
                  <button
                    id="mobile-paste-btn"
                    onClick={() => {
                      setMobileClipPasteResult(clipboard.text);
                      onAddLog?.(`Simulated: Mobile pasted text from system sync DB`, "clipboard", "Mobile-Android");
                    }}
                    className="bg-brand-gold text-black hover:bg-gold-light border border-brand-gold/20 font-bold uppercase tracking-wider py-1 px-3 rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1"
                  >
                     📥 Paste Shared Memo
                  </button>
                  <button
                    id="mobile-clear-paste"
                    onClick={() => setMobileClipPasteResult("")}
                    className="text-[9px] text-gray-500 hover:text-white px-2 py-1 uppercase font-bold tracking-wider"
                  >
                    Clear Box
                  </button>
                </div>

                <textarea
                  id="mobile-paste-area"
                  value={mobileClipPasteResult}
                  onChange={(e) => setMobileClipPasteResult(e.target.value)}
                  placeholder="The pasted clipboard text will appear here. Test modifying and writing on other node!"
                  className="w-full bg-[#111112] border border-white/5 rounded-lg text-xs p-2 text-white h-14 mt-1.5 focus:outline-none focus:border-brand-gold custom-scrollbar resize-none font-mono"
                />
              </div>

              {/* Copy on mobile widget */}
              <div className="mt-3.5 pt-3 border-t border-white/5 flex gap-2">
                <input
                  id="mobile-clip-input"
                  type="text"
                  value={mobileClipInput}
                  onChange={(e) => setMobileClipInput(e.target.value)}
                  placeholder="Copy text on Galaxy Phone..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg text-xs py-1.5 px-3 text-white focus:outline-none focus:border-brand-gold placeholder-gray-600 transition"
                />
                <button
                  id="mobile-copy-btn"
                  onClick={() => {
                    if (mobileClipInput.trim()) {
                      onSetClipboard(mobileClipInput, "Mobile-Android");
                      setMobileClipInput("");
                    }
                  }}
                  className="bg-brand-gold hover:bg-gold-light text-black text-xs font-bold uppercase tracking-wider px-4.5 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* SYNCED GRAPHICAL TASK CHECKBOXES */}
            <div className="bg-[#111112]/50 border border-white/5 p-4 rounded-xl flex flex-col flex-1 min-h-[160px] shadow-md">
              <h4 className="text-xs font-bold text-white font-space uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-brand-gold" /> Synced Active Task Sync
              </h4>

              {/* Add task form */}
              <div className="flex gap-2 mb-3 shrink-0">
                <input
                  id="mobile-task-input"
                  type="text"
                  value={mobileTaskText}
                  onChange={(e) => setMobileTaskText(e.target.value)}
                  placeholder="Create task on Mobile..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg text-xs py-1.5 px-3 text-white focus:outline-none focus:border-brand-gold placeholder-gray-600 transition"
                />
                <button
                  id="mobile-add-task-btn"
                  onClick={() => {
                    if (mobileTaskText.trim()) {
                      onAddTask(mobileTaskText, "Mobile-Android");
                      setMobileTaskText("");
                    }
                  }}
                  className="p-1.5 bg-brand-gold text-black hover:bg-gold-light rounded-lg transition cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Synced List */}
              <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar flex-1">
                {tasks.length === 0 ? (
                  <span className="text-center py-6 text-xs text-gray-500 block">No synced tasks. Add some!</span>
                ) : (
                  tasks.map((task) => (
                    <div
                      id={`mobile-task-${task.id}`}
                      key={task.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          id={`mobile-task-check-${task.id}`}
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => onToggleTask(task)}
                          className="rounded text-brand-gold focus:ring-brand-gold h-4 border-white/10 bg-[#050505] cursor-pointer"
                        />
                        <span className={`text-xs truncate ${task.completed ? "line-through text-gray-500" : "text-gray-200"}`}>
                          {task.text}
                        </span>
                      </div>
                      <span className="text-[8px] tracking-wider uppercase font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 rounded shrink-0">
                        {task.deviceSource === "Desktop-HP" ? "Laptop" : "Mobile"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* MOBILE ALARMS & REMINDERS WIDGET */}
            <div className="bg-[#111112]/50 border border-white/5 p-4 rounded-xl shrink-0">
              <h4 className="text-xs font-bold text-white font-space uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Hourglass className="h-4 w-4 text-brand-gold" /> Active Mobile Alarms
              </h4>

              <div className="flex gap-1.5 mb-3">
                <input
                  id="mobile-rem-input"
                  type="text"
                  value={mobileReminderText}
                  onChange={(e) => setMobileReminderText(e.target.value)}
                  placeholder="Set alarm text..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg text-[11px] py-1 px-3.5 text-white focus:outline-none focus:border-brand-gold placeholder-gray-600 transition"
                />
                <input
                  id="mobile-rem-time"
                  type="time"
                  value={mobileReminderTime}
                  onChange={(e) => setMobileReminderTime(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg text-[11px] py-1 px-1.5 text-white text-center focus:outline-none max-w-[65px]"
                />
                <button
                  id="mobile-add-rem-btn"
                  onClick={() => {
                    if (mobileReminderText.trim()) {
                      onAddReminder(mobileReminderText, mobileReminderTime, "Mobile-Android");
                      setMobileReminderText("");
                    }
                  }}
                  className="bg-brand-gold hover:bg-gold-light text-black text-[11px] font-bold uppercase tracking-wider px-3.5 rounded-lg transition cursor-pointer shrink-0"
                >
                  Set
                </button>
              </div>

              {/* Reminders List */}
              <div className="space-y-1.5 max-h-[80px] overflow-y-auto custom-scrollbar">
                {reminders.length === 0 ? (
                  <span className="text-[10px] text-gray-500 italic block text-center">No alarms synced.</span>
                ) : (
                  reminders.map((rem) => (
                    <div
                      id={`mobile-rem-${rem.id}`}
                      key={rem.id}
                      className="flex items-center justify-between px-2 py-1 bg-[#050505] border border-white/5 rounded-lg text-[11px]"
                    >
                      <span className="text-gray-400 truncate flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-semibold text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded shrink-0 border border-brand-gold/20">
                          {rem.time}
                        </span>
                        <span>{rem.text}</span>
                      </span>
                      <button
                        id={`mobile-rem-del-${rem.id}`}
                        onClick={() => onDeleteReminder(rem.id, "Mobile-Android")}
                        className="text-gray-600 hover:text-red-400 p-0.5 cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mobile Actions Overlay notifications */}
            <div className="flex border-t border-white/5 pt-3 justify-between items-center text-[10px] text-gray-400 shrink-0 select-none">
              <span className="font-mono text-[9px] text-brand-gold uppercase tracking-widest animate-pulse">● Secure System</span>
              <div className="flex items-center gap-1.5">
                <button
                  id="mobile-screenshot-btn"
                  onClick={() => handleScreenshot("Mobile-Android")}
                  className="hover:text-white cursor-pointer bg-white/5 border border-white/10 p-1 rounded"
                  title="Capture phone screen"
                >
                  <Camera className="h-4.5 w-4.5 text-brand-gold" />
                </button>
                <div className="text-[9px] bg-brand-gold/5 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                  Soni UI Active
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Floating alert/mock sfx widget */}
      {screenshotNotification && (
        <div id="scr-alert" className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-[#0a0a0a] border border-brand-gold text-brand-gold text-xs py-2.5 px-6 rounded-full shadow-2xl z-50 flex items-center gap-2 font-space">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-gold"></span>
          </span>
          <span>{screenshotNotification}</span>
        </div>
      )}

    </div>
  );
}
