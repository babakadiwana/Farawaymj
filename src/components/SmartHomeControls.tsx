import React from "react";
import { 
  Lightbulb, 
  Wind, 
  Lock, 
  Coffee, 
  Zap, 
  Power 
} from "lucide-react";

interface SmartHomeProps {
  onAddLog: (text: string, type: "system" | "task" | "clipboard" | "reminder" | "voice", source: string) => void;
  deviceStats: any;
  onUpdateDeviceStats: (newStats: any) => void;
}

export default function SmartHomeControls({ onAddLog, deviceStats, onUpdateDeviceStats }: SmartHomeProps) {
  // Extract values from unified deviceStats state, providing compliant fallbacks
  const lightsOn = deviceStats.smartLightsOn ?? true;
  const lightColor = deviceStats.smartLightsColor ?? "Gold";
  const lightBrightness = deviceStats.smartLightsBrightness ?? 80;

  const acOn = deviceStats.smartAcOn ?? true;
  const acTemp = deviceStats.smartAcTemp ?? 22;
  const acMode = deviceStats.smartAcMode ?? "cool";

  const doorLocked = deviceStats.smartGateLocked ?? true;
  
  const brewState = deviceStats.smartBrewState ?? "idle";
  const brewProgress = deviceStats.smartBrewProgress ?? 0;

  const triggerBrewCycle = () => {
    if (brewState !== "idle") return;
    onUpdateDeviceStats({ smartBrewState: "heating", smartBrewProgress: 10 });
    onAddLog("Smart Coffee: Espresso maker heating water...", "system", "Smart-Home-Chamber");

    setTimeout(() => {
      onUpdateDeviceStats({ smartBrewState: "pouring", smartBrewProgress: 55 });
      onAddLog("Smart Coffee: Grinding roasted beans & pouring espresso shot...", "system", "Smart-Home-Chamber");
    }, 1500);

    setTimeout(() => {
      onUpdateDeviceStats({ smartBrewState: "pouring", smartBrewProgress: 85 });
    }, 2800);

    setTimeout(() => {
      onUpdateDeviceStats({ smartBrewState: "completed", smartBrewProgress: 100 });
      onAddLog("☕ Smart Coffee: Brew completed! Fresh espresso is ready in Mahakal Sanctum.", "reminder", "Smart-Home-Chamber");
      
      // Auto reset
      setTimeout(() => {
        onUpdateDeviceStats({ smartBrewState: "idle", smartBrewProgress: 0 });
      }, 4000);
    }, 4000);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl hover:border-brand-gold/15 transition duration-300 text-left relative overflow-hidden">
      
      {/* Container header decoration */}
      <div className="absolute right-0 top-0 h-24 w-24 bg-brand-gold rounded-full filter blur-[80px] opacity-[0.02] select-none pointer-events-none"></div>

      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-space font-bold text-white uppercase tracking-wider text-sm">Smart Household sync center</h4>
            <p className="text-[10px] font-mono text-gray-500 uppercase">Bridged via Mahakal Secure Local Gateways</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] uppercase font-mono bg-green-500/10 text-green-400 px-2 py-0.5 border border-green-500/20 rounded font-bold">Grid Sync: OK</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Lights card */}
        <div className="bg-[#111112] border border-white/5 p-4 rounded-xl flex flex-col justify-between h-[160px] relative">
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/15">
              <Lightbulb className={`h-4.5 w-4.5 ${lightsOn ? "animate-pulse" : "opacity-40"}`} />
            </div>
            <button
              id="switch-smart-lights"
              onClick={() => {
                onUpdateDeviceStats({ smartLightsOn: !lightsOn });
                onAddLog(`Smart Light: Switched ${!lightsOn ? "ON" : "OFF"}`, "system", "Smart-Lights");
              }}
              className={`p-1 rounded-full cursor-pointer transition ${lightsOn ? "text-brand-gold bg-brand-gold/10" : "text-gray-600 bg-white/5"}`}
            >
              <Power className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 text-left">
            <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block">Appliance 1</span>
            <span className="text-xs font-semibold text-white">Accent Mood Lights</span>
            
            {lightsOn && (
              <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                <span className="text-brand-gold">{lightColor} • {lightBrightness}%</span>
                <div className="flex gap-1">
                  {["Gold", "RGB", "Amber"].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        onUpdateDeviceStats({ smartLightsColor: color });
                        onAddLog(`Smart Light Color updated to: ${color}`, "system", "Smart-Lights");
                      }}
                      className={`px-1 rounded text-[8px] bg-white/5 ${lightColor === color ? "text-brand-gold font-bold" : "text-gray-500"}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AC Cooling controller card */}
        <div className="bg-[#111112] border border-white/5 p-4 rounded-xl flex flex-col justify-between h-[160px]">
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/15">
              <Wind className={`h-4.5 w-4.5 ${acOn ? "animate-spin" : "opacity-40"}`} style={{ animationDuration: '4s' }} />
            </div>
            
            <button
              id="switch-smart-ac"
              onClick={() => {
                onUpdateDeviceStats({ smartAcOn: !acOn });
                onAddLog(`Smart Climate: AC unit toggled ${!acOn ? "ON" : "OFF"}`, "system", "Climate-Controller");
              }}
              className={`p-1 rounded-full cursor-pointer transition-all ${acOn ? "text-blue-400 bg-blue-500/15" : "text-gray-600 bg-white/5"}`}
            >
              <Power className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 text-left">
            <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block">Appliance 2</span>
            <span className="text-xs font-semibold text-white">HP Air Conditioning</span>
            
            {acOn && (
              <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                <span className="text-blue-400 font-bold">{acTemp}°C • {acMode.toUpperCase()}</span>
                <div className="flex gap-1 font-semibold">
                  <button onClick={() => {
                    const nextTemp = Math.max(16, acTemp - 1);
                    onUpdateDeviceStats({ smartAcTemp: nextTemp });
                  }} className="px-1 text-gray-400 hover:text-white cursor-pointer">-</button>
                  <button onClick={() => {
                    const nextTemp = Math.min(30, acTemp + 1);
                    onUpdateDeviceStats({ smartAcTemp: nextTemp });
                  }} className="px-1 text-gray-400 hover:text-white cursor-pointer">+</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Espresso coffee machine card */}
        <div className="bg-[#111112] border border-white/5 p-4 rounded-xl flex flex-col justify-between h-[160px]">
          <div className="flex items-start justify-between">
            <div className="p-1.5 rounded-lg bg-[#b58150]/10 text-[#b58150] border border-[#b58150]/15">
              <Coffee className={`h-4.5 w-4.5 ${brewState !== "idle" ? "animate-bounce" : ""}`} />
            </div>
            
            <button
              id="coffee-brew-trigger"
              onClick={triggerBrewCycle}
              disabled={brewState !== "idle"}
              className={`text-[9px] font-space font-bold uppercase tracking-wider py-1 px-3 cursor-pointer rounded-lg transition border ${
                brewState !== "idle"
                  ? "bg-amber-950/20 text-[#b58150] border-amber-900/30"
                  : "bg-brand-gold text-black border-transparent hover:bg-gold-light"
              }`}
            >
              {brewState === "idle" ? "Brew" : "Active"}
            </button>
          </div>

          <div className="mt-2 text-left space-y-1">
            <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block">Appliance 3</span>
            <span className="text-xs font-semibold text-white">Workspace Coffee Brew</span>
            
            {brewState !== "idle" && (
              <div className="w-full bg-[#050505] h-1 rounded overflow-hidden mt-1 relative">
                <div 
                  className="bg-brand-gold h-full transition-all duration-500" 
                  style={{ width: `${brewProgress}%` }}
                />
              </div>
            )}
            
            <span className="text-[8px] font-mono text-gray-400 block pt-0.5 truncate uppercase">
              {brewState === "idle" ? "☕ Ready to brew" : `☕ ${brewState}...`}
            </span>
          </div>
        </div>

        {/* Secure gate lock card */}
        <div className="bg-[#111112] border border-white/5 p-4 rounded-xl flex flex-col justify-between h-[160px]">
          <div className="flex items-start justify-between">
            <div className={`p-1.5 rounded-lg border ${doorLocked ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
              <Lock className="h-4.5 w-4.5" />
            </div>

            <button
              id="switch-smart-lock"
              onClick={() => {
                onUpdateDeviceStats({ smartGateLocked: !doorLocked });
                onAddLog(`Vault Lock: Door bio-locks successfully updated to ${!doorLocked ? "LOCKED" : "UNLOCKED"} state.`, "system", "Vault-Gate");
              }}
              className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded cursor-pointer transition font-space ${
                doorLocked 
                  ? "bg-red-950/40 text-red-400 border border-red-900/40" 
                  : "bg-green-950/40 text-green-400 border border-green-900/40"
              }`}
            >
              {doorLocked ? "Locked" : "Unlocked"}
            </button>
          </div>

          <div className="mt-2 text-left">
            <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block">Appliance 4</span>
            <span className="text-xs font-semibold text-white">Vedic Vault Main Gate</span>
            <span className="text-[8px] font-mono text-gray-500 block mt-1 uppercase">Mahakal Shield Bio Security</span>
          </div>
        </div>

      </div>
    </div>
  );
}
