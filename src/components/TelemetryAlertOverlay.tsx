import React, { useState } from "react";
import { 
  AlertTriangle, 
  Cpu, 
  Battery, 
  Zap, 
  Sparkles, 
  Wrench, 
  X, 
  CheckCircle2, 
  Activity,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

interface TelemetryAlertOverlayProps {
  deviceStats: {
    desktopPowerState: string;
    desktopTemp: number;
    desktopMute: boolean;
    desktopLightsColor: string;
    desktopAppsOpened: string[];
    mobileLockState: boolean;
    mobileBatterySaver: boolean;
    mobileAppsOpened: string[];
    batteryLevel: number;
    ramUsage: number;
  };
  onUpdateDeviceStats: (newStats: any) => void;
}

export default function TelemetryAlertOverlay({
  deviceStats,
  onUpdateDeviceStats
}: TelemetryAlertOverlayProps) {
  const [isFixingRam, setIsFixingRam] = useState(false);
  const [isFixingBattery, setIsFixingBattery] = useState(false);
  const [showTester, setShowTester] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Extract actual stats
  const ramUsage = deviceStats?.ramUsage !== undefined ? deviceStats.ramUsage : 14.2;
  const batteryLevel = deviceStats?.batteryLevel !== undefined ? deviceStats.batteryLevel : 88;

  // Determine warnings
  const isHighRam = ramUsage > 90 || (ramUsage <= 32 && (ramUsage / 32) * 100 > 90);
  const isLowBattery = batteryLevel < 15;

  const hasAlert = isHighRam || isLowBattery;

  // Action fixes
  const handleFixRam = async () => {
    setIsFixingRam(true);
    // Simulate real high-tech purging sequence
    setTimeout(() => {
      onUpdateDeviceStats({
        ramUsage: 8.1,
        desktopTemp: 38
      });
      setIsFixingRam(false);
    }, 1500);
  };

  const handleFixBattery = async () => {
    setIsFixingBattery(true);
    // Simulate plugging in fast charger
    setTimeout(() => {
      onUpdateDeviceStats({
        batteryLevel: 98,
        mobileBatterySaver: false
      });
      setIsFixingBattery(false);
    }, 1500);
  };

  const triggerMockHighRam = () => {
    setIsDismissed(false);
    onUpdateDeviceStats({ ramUsage: 94.8 });
  };

  const triggerMockLowBattery = () => {
    setIsDismissed(false);
    onUpdateDeviceStats({ batteryLevel: 11 });
  };

  const triggerMockBoth = () => {
    setIsDismissed(false);
    onUpdateDeviceStats({
      ramUsage: 96.2,
      batteryLevel: 8
    });
  };

  const resetAllStats = () => {
    onUpdateDeviceStats({
      ramUsage: 14.2,
      batteryLevel: 88,
      desktopTemp: 42,
      mobileBatterySaver: false
    });
  };

  // If dismissed or no active alerts, we still optionally render the small emulator testing deck
  // so the user can easily invoke alerts and test the system on screen click!
  return (
    <>


      {/* ⚠️ SYSTEM TELEMETRY ALERT NOTIFICATION OVERLAY (Corner slide-in block) */}
      {hasAlert && !isDismissed && (
        <div 
          id="telemetry-notification-overlay" 
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0a0a0c]/95 backdrop-blur-md border border-red-500/30 rounded-2xl p-5 shadow-2xl transition-all duration-300 animate-slide-up hover:border-red-500/60"
        >
          {/* Subtle Red Overlay Gradient Effect */}
          <div className="absolute inset-0 bg-red-500/[0.02] rounded-2xl pointer-events-none select-none"></div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3 shrink-0 relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg animate-pulse">
                <ShieldAlert className="h-5 w-5" />
              </span>
              <div>
                <h4 className="font-space font-bold text-white text-xs sm:text-sm uppercase tracking-wider">
                  MJ Synapse Alert
                </h4>
                <p className="text-[9px] text-[#ff6b6b] uppercase font-mono tracking-widest mt-0.5">
                  Telemetry Exceeded Threshold
                </p>
              </div>
            </div>
            
            <button 
              id="dismiss-telemetry-overlay"
              onClick={() => setIsDismissed(true)}
              className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              title="Dismiss warning"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            {/* ALERT 1: HIGH RAM */}
            {isHighRam && (
              <div 
                id="ram-critical-block"
                className="p-3.5 bg-red-950/20 rounded-xl border border-red-500/20 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-red-500" />
                    <span className="text-white text-xs font-bold font-space uppercase">OMEN PC RAM Leaking</span>
                  </div>
                  <span className="text-red-400 font-mono text-xs font-extrabold animate-pulse bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                    CRITICAL
                  </span>
                </div>
                
                <p className="text-[11px] text-gray-300 leading-relaxed font-serif italic">
                  Desktop memory is severely leaking. Current RAM is running at <b className="text-white font-mono not-italic">{ramUsage > 32 ? `${ramUsage.toFixed(1)}%` : `${ramUsage.toFixed(1)} / 32 GB (${((ramUsage/32)*100).toFixed(1)}%)`}</b>. Performance throttling is imminent.
                </p>

                {/* Optimizing Progress bar inside button helper */}
                <button
                  id="execute-ram-fix-btn"
                  type="button"
                  onClick={handleFixRam}
                  disabled={isFixingRam}
                  className="w-full mt-2.5 bg-red-500 text-black hover:bg-red-400 disabled:bg-[#151515] disabled:text-gray-500 disabled:border-white/5 border border-red-400/20 text-xs font-extrabold uppercase tracking-wider py-2 px-4 rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 hover:shadow-red-500/25"
                >
                  {isFixingRam ? (
                    <>
                      <Zap className="h-3.5 w-3.5 animate-spin text-brand-gold" />
                      <span>Executing RAM Purge Engine...</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="h-3.5 w-3.5" />
                      <span>⚡ Fix: Execute RAM Purge Code</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ALERT 2: LOW BATTERY */}
            {isLowBattery && (
              <div 
                id="battery-critical-block"
                className="p-3.5 bg-amber-950/20 rounded-xl border border-amber-500/20 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-amber-500 animate-bounce" />
                    <span className="text-white text-xs font-bold font-space uppercase">Galaxy Battery Draining</span>
                  </div>
                  <span className="text-amber-500 font-mono text-xs font-extrabold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {batteryLevel}% LEVEL
                  </span>
                </div>

                <p className="text-[11px] text-gray-300 leading-relaxed font-serif italic">
                  Mobile replica node has dropped below threshold (<b className="text-white/95">15%</b> limit). Disconnecting from central database socket queue soon.
                </p>

                <button
                  id="execute-battery-fix-btn"
                  type="button"
                  onClick={handleFixBattery}
                  disabled={isFixingBattery}
                  className="w-full mt-2.5 bg-amber-500 text-black hover:bg-amber-400 disabled:bg-[#151515] disabled:text-gray-500 disabled:border-white/5 border border-amber-400/20 text-xs font-extrabold uppercase tracking-wider py-2 px-4 rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25"
                >
                  {isFixingBattery ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 animate-pulse text-white" />
                      <span>Plugging in Cloud Charger...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5" />
                      <span>🔌 Fix: Plug Supercharger & LPM</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Toast Footer advice */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono relative z-10">
            <span>Awaiting system bridging...</span>
            <span className="text-brand-gold animate-pulse flex items-center gap-1">
              Live Monitoring <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      )}
    </>
  );
}
