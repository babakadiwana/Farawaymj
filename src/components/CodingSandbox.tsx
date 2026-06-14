import React, { useState } from "react";
import { 
  Play, 
  Terminal, 
  Sparkles, 
  CheckCircle, 
  Cpu, 
  RefreshCw, 
  Volume2, 
  BookOpen, 
  Code2, 
  Maximize2 
} from "lucide-react";

interface CodingSandboxProps {
  onAddLog: (text: string, type: "system" | "task" | "clipboard" | "reminder" | "voice", source: string) => void;
  speakText: (text: string) => void;
}

const CONSTANT_TEMPLATES = {
  react: `// React State Desynchronization Issue
import React, { useState, useEffect } from 'react';

export default function UserSyncProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // BUG: Infinite re-render cycle triggered here!
    fetch('/api/sync/profile')
      .then(res => res.json())
      .then(data => setProfile(data));
  }, [profile]); // Reference dependency triggers infinite loop

  return (
    <div>
      <h3>User: {profile?.name}</h3>
    </div>
  );
}`,
  typescript: `// TypeScript Strict Type Alignment Failure
interface SmartTelemetry {
  deviceId: string;
  temperature: number;
  lightsIntensity?: number;
  powerState: "on" | "off" | "sleep";
}

function configureOmenPower(config: SmartTelemetry) {
  // BUG: Property 'overclockBoost' does not exist on type 'SmartTelemetry'
  if (config.overclockBoost) {
    console.log("Supercharging Omen Processor core...");
  }
  
  // BUG: Type '"standby"' is not assignable to type '"on" | "off" | "sleep"'
  config.powerState = "standby"; 
}`,
  python: `# High Latency SQL Database Sync Routine
import time
import sqlite3

def backup_device_records(records):
    db = sqlite3.connect("central_sync.db")
    cursor = db.cursor()
    # BUG: N+1 DB insertion loop causing extreme disk I/O latency
    for r in records:
        cursor.execute("INSERT INTO logs (timestamp, detail) VALUES (?, ?)", (r['time'], r['text']))
        db.commit() # Committing on every item is highly inefficient!
    db.close()
`
};

export default function CodingSandbox({ onAddLog, speakText }: CodingSandboxProps) {
  const [selectedLang, setSelectedLang] = useState<"react" | "typescript" | "python">("react");
  const [code, setCode] = useState(CONSTANT_TEMPLATES.react);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  const loadTemplate = (lang: "react" | "typescript" | "python") => {
    setSelectedLang(lang);
    setCode(CONSTANT_TEMPLATES[lang]);
    onAddLog(`Coding Sandbox: Loaded ${lang.toUpperCase()} template`, "system", "UI-Control");
  };

  const handleAIAction = async (action: "explain" | "refactor" | "test") => {
    setLoading(true);
    setOutput("");
    onAddLog(`Dispatched AI Coding prompt: ${action.toUpperCase()}`, "voice", "Coding-Sandbox");

    try {
      const response = await fetch("/api/mj/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze the following code, then fulfill the action "${action}":
          Language: ${selectedLang}
          Code content:
          ${code}
          
          Respond back in your premium voice personality, with a clear code section if needed. Keep spacing clean.`,
          personalityMode: "Super-Nerd Mode 🤓",
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOutput(data.response);
        onAddLog(`Received AI feedback on code`, "voice", "MJ-Brain");
        speakText("I have analyzed your code structure! Read the terminal sidebar panel for full refactorings.");
      } else {
        setOutput("Error: Could not retrieve AI diagnostics from the server endpoint.");
      }
    } catch (err) {
      console.error(err);
      setOutput("Database synapse offline. Simulated fallback optimization complete!");
    } finally {
      setLoading(false);
    }
  };

  const runDiagnostics = () => {
    setIsCompiling(true);
    setTerminalLogs(["TSC CLOUD COMPILER INITIATED...", "Checking typescript dependencies..."]);
    
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, "Syncing AST structures over Mahakal Secure node... [OK]"]);
    }, 450);

    setTimeout(() => {
      // Find bugs in text to simulate real compilation
      const errorsFound: string[] = [];
      if (code.includes("[profile]") && selectedLang === "react") {
        errorsFound.push("Line 12: React compilation warning - Infinite Hook loop detected inside [profile] useEffect dependency.");
      }
      if (code.includes("overclockBoost") && selectedLang === "typescript") {
        errorsFound.push("Line 11: Property 'overclockBoost' does not exist on type 'SmartTelemetry' interface.");
        errorsFound.push("Line 16: Type '\"standby\"' is not assignable to type '\"on\" | \"off\" | \"sleep\"'.");
      }
      if (code.includes("db.commit()") && selectedLang === "python") {
        errorsFound.push("Line 9: Database performance alert - Sequential commits in iteration loop trigger extreme disk I/O bottlenecks.");
      }

      if (errorsFound.length > 0) {
        setTerminalLogs(prev => [
          ...prev,
          ...errorsFound,
          "❌ DIAGNOSTIC RESULT: 1 or more systemic issues found! Code compilation failed."
        ]);
        onAddLog("Sandbox diagnostic compilation complete. Found code issues!", "system", "HP-Omen-Desktop");
      } else {
        setTerminalLogs(prev => [
          ...prev,
          "Analyzing logical closures... [OK]",
          "Optimizing memory pointers... [OK]",
          "✨ DIAGNOSTIC RESULT: Build succeeded perfectly! 100% stable structure ready for remote deployment."
        ]);
        onAddLog("Sandbox diagnostic compilation complete: Build succeeded perfectly!", "system", "HP-Omen-Desktop");
      }
      setIsCompiling(false);
    }, 1200);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute right-0 top-0 h-44 w-44 bg-[#c5a36c] rounded-full filter blur-[140px] opacity-[0.03] pointer-events-none"></div>
      
      <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
            <Code2 className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="font-space font-bold text-white uppercase tracking-wider text-sm sm:text-base">AI Coding & Diagnostics Center</h3>
            <p className="text-[11px] text-gray-400 font-serif italic">Real-time code debugging and system compiler simulation</p>
          </div>
        </div>

        <div className="flex gap-2 font-mono">
          <button 
            id="btn-lang-react"
            onClick={() => loadTemplate("react")}
            className={`px-3 py-1 text-[10px] rounded border ${selectedLang === "react" ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30" : "bg-white/5 border-transparent text-gray-500"}`}
          >
            React Hook
          </button>
          <button 
            id="btn-lang-ts"
            onClick={() => loadTemplate("typescript")}
            className={`px-3 py-1 text-[10px] rounded border ${selectedLang === "typescript" ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30" : "bg-white/5 border-transparent text-gray-500"}`}
          >
            TS Strict
          </button>
          <button 
            id="btn-lang-py"
            onClick={() => loadTemplate("python")}
            className={`px-3 py-1 text-[10px] rounded border ${selectedLang === "python" ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30" : "bg-white/5 border-transparent text-gray-500"}`}
          >
            Python SQL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Editor Screen */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center bg-[#111112] px-4 py-2 border border-white/5 rounded-t-xl text-[11px] font-mono">
            <span className="text-[#888] font-mono flex items-center gap-1.5 uppercase font-bold">
              <Terminal className="h-3.5 w-3.5 text-brand-gold" /> Editor - Omen Sandbox
            </span>
            <span className="text-brand-gold text-[10px]">{selectedLang.toUpperCase()} file</span>
          </div>
          
          <textarea
            id="sandbox-code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 bg-[#050505] border border-t-0 border-white/10 rounded-b-xl p-4 font-mono text-xs text-[#a9b1d6] leading-relaxed focus:outline-none focus:border-brand-gold transition duration-200"
            spellCheck="false"
          />

          {/* Quick AI Assist buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              id="code-explain-btn"
              onClick={() => handleAIAction("explain")}
              disabled={loading}
              className="px-4 py-2 bg-[#111112] border border-white/5 text-gray-300 rounded-lg text-[10px] cursor-pointer hover:border-brand-gold/30 hover:text-white uppercase font-bold font-space flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-brand-gold" /> Explain Code with MJ
            </button>
            <button
              id="code-refactor-btn"
              onClick={() => handleAIAction("refactor")}
              disabled={loading}
              className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-lg text-[10px] cursor-pointer hover:bg-brand-gold hover:text-black uppercase font-bold font-space flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Refactor & Optimize
            </button>
            <button
              id="code-test-btn"
              onClick={() => handleAIAction("test")}
              disabled={loading}
              className="px-4 py-2 bg-[#111112] border border-white/5 text-gray-300 rounded-lg text-[10px] cursor-pointer hover:border-brand-gold/30 hover:text-white uppercase font-bold font-space flex items-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5 text-brand-gold" /> Generate Tests
            </button>
          </div>
        </div>

        {/* Diagnostic Terminal & Outputs */}
        <div className="lg:col-span-5 flex flex-col h-full gap-4">
          
          {/* Terminal Logs */}
          <div className="bg-[#050505] rounded-xl border border-white/5 flex-1 flex flex-col p-4 font-mono text-[11px] min-h-[160px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
              <span className="text-white uppercase font-bold tracking-wider text-[9px] flex items-center gap-1">
                <Cpu className="h-3 w-3 text-brand-gold" /> Omen Diagnostic Compiler
              </span>
              <button
                id="execute-compiler-btn"
                onClick={runDiagnostics}
                className="text-[9px] uppercase tracking-wider bg-brand-gold text-black hover:bg-gold-light rounded font-bold px-3 py-1 flex items-center gap-1 cursor-pointer transition-all"
                disabled={isCompiling}
              >
                {isCompiling ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                Run Build
              </button>
            </div>
            
            <div className="flex-1 space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar text-[#a0a0a5]">
              {terminalLogs.length === 0 ? (
                <span className="text-gray-600 block italic">Ready to run telemetry compilation diagnostic...</span>
              ) : (
                terminalLogs.map((log, index) => {
                  let logColor = "text-gray-400";
                  if (log.includes("❌") || log.includes("warning") || log.includes("failed")) logColor = "text-red-400";
                  if (log.includes("✨") || log.includes("[OK]")) logColor = "text-emerald-400";
                  return (
                    <div key={index} className={`font-mono leading-tight whitespace-pre-wrap ${logColor}`}>
                      &gt; {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Response Output */}
          <div className="bg-[#111112] rounded-xl border border-white/5 p-4 flex flex-col h-[230px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
              <span className="text-brand-gold uppercase text-[9px] tracking-wider font-bold">MJ AI Feed Diagnostics</span>
              {output && (
                <button
                  id="sandbox-speak-diag"
                  onClick={() => speakText(output)}
                  className="text-gray-400 hover:text-brand-gold transition duration-200 cursor-pointer"
                  title="Speak Response"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar text-xs leading-relaxed text-gray-300 pr-1 text-left font-mono whitespace-pre-wrap">
              {loading ? (
                <div className="flex items-center gap-2 py-4 justify-center text-gray-500 italic">
                  <RefreshCw className="h-4 w-4 animate-spin text-brand-gold" />
                  <span>MJ analysis engine traversing code variables...</span>
                </div>
              ) : output ? (
                output
              ) : (
                <span className="text-gray-600 italic">No AI response generated yet. Run deep refactoring or explanation triggers above to engage the synapses.</span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
