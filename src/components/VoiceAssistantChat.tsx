import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Mic, 
  Cpu, 
  Smile, 
  Shield, 
  Settings, 
  Bell, 
  Compass, 
  Zap, 
  Music, 
  Trash2, 
  AlertTriangle,
  Lock,
  Wind,
  Coffee,
  CheckCircle2,
  ListTodo
} from "lucide-react";

interface VoiceAssistantChatProps {
  onAddLog: (text: string, type: "system" | "task" | "clipboard" | "reminder" | "voice", source: string) => void;
  triggerSyncRefresh: () => void;
}

export default function VoiceAssistantChat({ onAddLog, triggerSyncRefresh }: VoiceAssistantChatProps) {
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState("Friend Mode");
  const [language, setLanguage] = useState("Hinglish/English");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [continuousListening, setContinuousListening] = useState(true);

  // Transcription states
  const [userTranscript, setUserTranscript] = useState("");
  const [mjSpeechText, setMjSpeechText] = useState("नमस्ते Team Mahakal! I am MJ, your independent brain. Continuous always-on voice capture is active! Speak naturally or use quick voice triggers to automate our digital ecosystem! 🔮✨");

  // Soundwave animation refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [soundLevel, setSoundLevel] = useState(0);
  const soundLevelRef = useRef(0);

  useEffect(() => {
    soundLevelRef.current = soundLevel;
  }, [soundLevel]);

  // Permission & hardware telemetry states
  const [showPermissions, setShowPermissions] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | "unsupported">("default");
  const [realBattery, setRealBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const [realMemory, setRealMemory] = useState<number | null>(null);

  // Real Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Secure Local Camera Scan states
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Recent local action logs for independent brain visual feed
  const [brainActivity, setBrainActivity] = useState<Array<{ id: string; msg: string; type: string; stamp: string }>>([
    { id: "act-1", msg: "Independent Cognitive Brain initialized in Mahakal System standard environment", type: "system", stamp: "Just Now" }
  ]);

  const addBrainLog = (msg: string, type: string) => {
    setBrainActivity(prev => [
      { id: `bact-${Date.now()}`, msg, type, stamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
      ...prev.slice(0, 4)
    ]);
  };

  const personalities = [
    { name: "Friend Mode", icon: Smile, desc: "Casual, witty Hinglish buddy" },
    { name: "Professional Mode", icon: Cpu, desc: "Efficient and direct workspace brain" },
    { name: "Zen Mode 🧘", icon: Compass, desc: "Peaceful breathing guides" },
    { name: "Cyberpunk Hacker 🚀", icon: Zap, desc: "Neon grids telemetry" }
  ];

  const languages = [
    { label: "English / Hinglish", val: "Hinglish/English" },
    { label: "हिंदी (Hindi)", val: "Hindi" },
    { label: "ગુજરાતી (Gujarati)", val: "Gujarati" }
  ];

  const quickTriggers = [
    { label: "Switch screen to YouTube Lounge", cmd: "Switch screen to YouTube Lounge and play lo-fi coding tracks, MJ", icon: Music, color: "hover:border-red-500/30" },
    { label: "Flush RAM, clean background caches", cmd: "Optimize my Omen system. Clean my background memory and flush cache", icon: Cpu, color: "hover:border-amber-500/30" },
    { label: "Toggle Omen speakers state to MUTED", cmd: "Mute computer sound or toggle desktop audio state, MJ", icon: VolumeX, color: "hover:border-sky-550/30" },
    { label: "Brew workspace gold double espresso", cmd: "Brew me a hot espresso coffee in my chambers", icon: Coffee, color: "hover:border-amber-700/30" },
    { label: "Biometric lock Vedic vault main gate", cmd: "Fully lock our main security door vault gate immediately", icon: Lock, color: "hover:border-red-650/30" },
    { label: "Configure climate AC to 21 degrees", cmd: "Cool down Mahakal chamber and configure smart AC to 21 degrees", icon: Wind, color: "hover:border-blue-500/30" },
    { label: "Durable sync: Create a new coding task", cmd: "Add a high priority coding task: Complete automated speech synthesis integration", icon: ListTodo, color: "hover:border-emerald-500/30" }
  ];

  // Synchronized Refs to avoid closure capture issues with SpeechRecognition callbacks
  const continuousListeningRef = useRef(true);
  const isSpeakingRef = useRef(false);
  const loadingRef = useRef(false);
  const languageRef = useRef(language);

  useEffect(() => {
    continuousListeningRef.current = continuousListening;
  }, [continuousListening]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  // Clean simulated sound level visualization to avoid physical browser microphone resource conflicts with Web Speech Recognition
  useEffect(() => {
    let animationFrameId: number;

    if (isListening) {
      let tick = 0;
      const simulateMic = () => {
        tick += 0.15;
        const base = Math.sin(tick) * 0.45 + 0.45;
        const noise = Math.random() * 0.25;
        const level = Math.max(0.1, Math.min(1.0, base + noise));
        setSoundLevel(level);
        animationFrameId = requestAnimationFrame(simulateMic);
      };
      simulateMic();
    } else if (isSpeaking) {
      // Warm rhythmic vocal animation to indicate active talking state
      let tick = 0;
      const simulateSpeaking = () => {
        tick += 0.2;
        const base = Math.sin(tick) * 0.5 + 0.5;
        const noise = Math.random() * 0.25;
        const level = Math.max(0.15, Math.min(1.1, base + noise));
        setSoundLevel(level);
        animationFrameId = requestAnimationFrame(simulateSpeaking);
      };
      simulateSpeaking();
    } else {
      setSoundLevel(0);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isSpeaking]);

  const triggerRestartListening = () => {
    if (!recognitionRef.current) return;
    try {
      if (languageRef.current === "Hindi") {
        recognitionRef.current.lang = "hi-IN";
      } else if (languageRef.current === "Gujarati") {
        recognitionRef.current.lang = "gu-IN";
      } else {
        recognitionRef.current.lang = "en-IN";
      }
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      // Already running
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setUserTranscript("Always listening... Speak naturally!");
        onAddLog("Hands-free voice capture active. Listening to user...", "voice", "Browser-Mic");
        addBrainLog("Hands-free mic activated: Continuous capture live", "voice");
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setUserTranscript(text);
        onAddLog(`Voice Dictation transcribed: "${text}"`, "voice", "User-Mic");
        addBrainLog(`Synapse Dictation accepted: "${text}"`, "sync");
        triggerVoiceBrain(text);
      };

      rec.onend = () => {
        setIsListening(false);
        // Automatically restart listening if hands-free continuous mode is active
        if (continuousListeningRef.current && !isSpeakingRef.current && !loadingRef.current) {
          setTimeout(() => {
            if (continuousListeningRef.current && !isSpeakingRef.current && !loadingRef.current) {
              triggerRestartListening();
            }
          }, 350);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech Recognition error:", err);
        addBrainLog("Mic capture paused or busy, auto-resuming...", "error");
        setIsListening(false);
        if (continuousListeningRef.current && !isSpeakingRef.current && !loadingRef.current) {
          setTimeout(() => {
            if (continuousListeningRef.current && !isSpeakingRef.current && !loadingRef.current) {
              triggerRestartListening();
            }
          }, 1500);
        }
      };

      recognitionRef.current = rec;

      // Start automatically on mount
      setTimeout(() => {
        if (continuousListeningRef.current) {
          triggerRestartListening();
        }
      }, 1200);
    }
  }, [onAddLog]);

  const toggleSpeechListen = () => {
    if (isListening) {
      setContinuousListening(false);
      recognitionRef.current?.stop();
    } else {
      setContinuousListening(true);
      if (!recognitionRef.current) {
        // Fallback simulate trigger if web speech recognition is restricted/not supported in preview
        const randomFallbackText = promptFallbackCommand();
        setUserTranscript(randomFallbackText);
        addBrainLog(`Simulated Voice Input: "${randomFallbackText}"`, "voice");
        triggerVoiceBrain(randomFallbackText);
        return;
      }
      triggerRestartListening();
    }
  };

  const promptFallbackCommand = () => {
    const fallbacks = [
      "Mute computer speakers, MJ",
      "Switch screen to YouTube Lounge view",
      "Clean RAM cache and boost system",
      "Brew me a cup of workspace espresso",
      "Biometric lock the main vault gate",
      "Configure climate AC to 21 degrees, MJ",
      "Add a coding task to write automated tests today"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  // Hardware and Notification permission checks
  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    } else {
      setNotifPermission("unsupported");
    }

    if ('deviceMemory' in navigator) {
      setRealMemory((navigator as any).deviceMemory);
    }

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setRealBattery({
          level: Math.round(battery.level * 100),
          charging: battery.charging
        });
      }).catch((e: any) => console.log("Battery permission restricted inside local iframe", e));
    }
  }, []);

  const requestNotifPermission = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setNotifPermission(res);
      onAddLog(`System Notification permission updated to: ${res.toUpperCase()}`, "system", "Browser-Agent");
      if (res === "granted") {
        new Notification("MJ Independent Voice Sync", {
          body: "Hello Team Mahakal! Central core notification bridge is successfully online.",
          icon: "/favicon.ico"
        });
      }
    }
  };

  // Soundwave Audio Visualizer effect
  useEffect(() => {
    if (isSpeaking || isListening) {
      startVisualizer();
    } else {
      stopVisualizer();
    }
    return () => stopVisualizer();
  }, [isSpeaking, isListening]);

  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let step = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = 3;
      const barSpacing = 2;
      const barCount = Math.floor(canvas.width / (barWidth + barSpacing));
      
      for (let i = 0; i < barCount; i++) {
        // Dynamic audio wave amplitude reacting directly to our soundLevel state
        const currentLevel = soundLevelRef.current;
        const indexOffset = i - barCount / 2;
        // Bell curve weight so it looks like a localized voice burst in the middle
        const bellWeight = Math.exp(-Math.pow(indexOffset / (barCount / 4), 2));
        
        let multiplier = 0.1;
        if (isSpeaking) {
          multiplier = Math.sin(step + i * 0.15) * Math.cos(step * 0.25 + i * 0.08);
        } else if (isListening) {
          multiplier = Math.sin(step * 1.5 + i * 0.3) * Math.cos(step * 0.7 + i * 0.15);
        }

        const waveHeight = (currentLevel * 0.75 + 0.1) * Math.abs(multiplier) * bellWeight;
        const height = waveHeight * (canvas.height - 4) + 2;
        const x = i * (barWidth + barSpacing);
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        if (isListening) {
          gradient.addColorStop(0, "#ef4444"); // Glowing Fire Red
          gradient.addColorStop(1, "#fca5a5"); // Warm pastel red
        } else {
          gradient.addColorStop(0, "#c5a36c"); // Premium Warm Gold
          gradient.addColorStop(1, "#f5ebd8"); // Elegant champagne white
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, height);
      }
      step += 0.25;
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const stopVisualizer = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw elegant linear baseline
        ctx.fillStyle = "#161617";
        ctx.fillRect(5, canvas.height / 2 - 1, canvas.width - 10, 2);
      }
    }
  };

  // Camera activation handlers
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      onAddLog("MJ Live Camera Scan Synapse successfully active.", "system", "Browser-Camera");
      addBrainLog("Camera Scan activated: Facial bio tracking active", "system");
    } catch (err) {
      console.error("Camera access restricted in sandbox", err);
      onAddLog("Camera connection denied or unavailable inside iframe.", "system", "Browser-Camera");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    onAddLog("Camera Scan deactivated successfully.", "system", "Browser-Camera");
    addBrainLog("Camera scan deactivated", "system");
  };

  // Perform Speech Synthesis (TTS voice output)
  const speakText = (text: string) => {
    if (!ttsEnabled) return;
    
    // Shut down previous speech and stop current recognition to avoid hearing ourselves
    window.speechSynthesis?.cancel();
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
    setIsListening(false);

    // Clean up trailing tags, markup and emojis for clean pronunciation
    const cleanedText = text
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "")
      .replace(/\*{1,2}/g, ""); // Strip any markdown bold asterisks

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voices = window.speechSynthesis?.getVoices() || [];
    let selectedVoice = null;

    if (language === "Hindi") {
      selectedVoice = voices.find((v) => v.lang.toLowerCase().includes("hi-in") || v.lang.toLowerCase().startsWith("hi"));
    } else if (language === "Gujarati") {
      selectedVoice = voices.find((v) => v.lang.toLowerCase().includes("gu-in") || v.lang.toLowerCase().startsWith("gu"));
    } else {
      // Prioritize Indian English (en-IN) voice for Hinglish/English dialect so Hinglish words pronunciation is clean and proper
      selectedVoice = voices.find((v) => v.lang.toLowerCase().includes("en-in") || v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("indian"));
      if (!selectedVoice) {
        selectedVoice = voices.find((v) => v.lang.toLowerCase().includes("hi-in"));
      }
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) => v.name.includes("Google") && v.name.includes("Female")
      );
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) => v.lang.startsWith("en") && (v.name.includes("Zira") || v.name.includes("Samantha") || v.name.includes("Google") || v.name.includes("Hazel"))
      );
    }
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    // Standard rate is 1.0; 0.93-0.95 gives supreme elegance, clarity and allows Indian vowels to articulate fully
    utterance.rate = 0.93;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    const handleSpeechFinished = () => {
      setIsSpeaking(false);
      // Restart continuous listening if active
      if (continuousListeningRef.current && !loadingRef.current) {
        setTimeout(() => {
          if (continuousListeningRef.current && !isSpeakingRef.current && !loadingRef.current) {
            triggerRestartListening();
          }
        }, 500);
      }
    };

    utterance.onend = handleSpeechFinished;
    utterance.onerror = handleSpeechFinished;

    window.speechSynthesis?.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    if (continuousListeningRef.current && !loadingRef.current) {
      setTimeout(() => {
        triggerRestartListening();
      }, 500);
    }
  };

  // Central voice integration bridge to retrieve AI decisions
  const triggerVoiceBrain = async (vocalQuery: string) => {
    if (!vocalQuery.trim() || loading) return;

    setLoading(true);
    stopSpeaking();
    setUserTranscript(vocalQuery);

    try {
      const response = await fetch("/api/mj/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${vocalQuery} (Reply vocal-friendly in ${language} dialect format)`,
          chatHistory: [],
          personalityMode: personality,
        }),
      });

      const data = await response.json();
      const replyText = data.response || "I could not formulate a clear verbal response for Team Mahakal.";
      
      setMjSpeechText(replyText);
      addBrainLog(`Brain responded in [${personality}]`, "brain");
      onAddLog(`Processed independent cognitive response [${personality}]`, "voice", "MJ-Brain");
      triggerSyncRefresh();

      // Trigger automatic TTS speaking
      if (ttsEnabled) {
        speakText(replyText);
      }

      // Handle Automation Action returned
      if (data.action) {
        const actType = data.action.action;
        const actTarget = data.action.target;
        const actVal = data.action.value;

        addBrainLog(`Automated transaction dispatched: ${actType.toUpperCase()}`, "sync");
        onAddLog(`Dispatched synchronized action: ${actType.toUpperCase()}`, "voice", "Central-Cloud");

        // Action 1: Switch tab dynamically
        if (actType === "switch_tab" && actVal) {
          const tabId = `tab-${actVal.toLowerCase().replace(/\s+/g, '-')}`;
          const targetTabBtn = document.getElementById(tabId);
          if (targetTabBtn) {
            targetTabBtn.click();
            addBrainLog(`Rendered View mutated automatically to: ${actVal.toUpperCase()}`, "system");
          }
        }

        // Action 2: Play Youtube
        if (actType === "play_youtube" && actVal) {
          localStorage.setItem("youtube_auto_query", actVal);
          // Auto route to YouTube tab
          const ytTabBtn = document.getElementById("tab-youtube");
          if (ytTabBtn) {
            ytTabBtn.click();
          }
          addBrainLog(`Auto search initialized in YouTube room: "${actVal}"`, "sync");
        }

        // Action 3: Handle WhatsApp popup
        if (actType === "whatsapp_message" && data.action.url) {
          setTimeout(() => {
            window.open(data.action.url, "_blank");
          }, 1500);
          addBrainLog(`Staged WhatsApp thread popup to papa`, "sync");
        }
      }

    } catch (err) {
      console.error(err);
      const fallbackError = "Sorry Team Mahakal, your in-memory synchronization grid remains active but I hit a brief cloud latency blip.";
      setMjSpeechText(fallbackError);
      if (ttsEnabled) speakText(fallbackError);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTrigger = (cmdText: string) => {
    addBrainLog(`Quick trigger: Simulated voice input`, "voice");
    triggerVoiceBrain(cmdText);
  };

  // Load Astrology horoscope shortcut
  const handleAstroTrigger = () => {
    addBrainLog("Astrology shortcut clicked", "system");
    triggerVoiceBrain("Generate Team Mahakal's celestial Horoscope and show Rashi Fal");
  };

  return (
    <div id="voice-assistant-section" className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[650px] relative transition-all duration-300 hover:border-brand-gold/15">
      
      {/* Voice Assistant Header */}
      <div className="bg-[#111112] p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-black animate-pulse"></span>
            <div className="p-2 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-xl">
              <Sparkles className="h-4.5 w-4.5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h3 className="font-space font-extrabold text-white tracking-wide text-sm">MJ INDEPENDENT BRAIN</h3>
              <span className="text-[7.5px] uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/20 px-1.5 py-0.5 rounded-full font-mono font-bold">Vocal Sync</span>
            </div>
            <p className="text-[10px] text-gray-500 font-serif italic">Pure voice input-output automation</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio vocal output speaker active button */}
          <button 
            id="tts-toggle-btn"
            onClick={() => {
              setTtsEnabled(!ttsEnabled);
              if (isSpeaking) stopSpeaking();
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${ttsEnabled ? "bg-brand-gold/15 text-brand-gold border-brand-gold/20" : "bg-white/5 text-gray-500 border-white/10"}`}
            title={ttsEnabled ? "Vocal Output (TTS) Sync active" : "Vocal output muted"}
          >
            {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          
          <button 
            id="camera-synapse-btn"
            type="button"
            onClick={cameraActive ? stopCamera : startCamera}
            className={`text-[9px] uppercase tracking-wider transition-all rounded-md px-2.5 py-1.5 font-space flex items-center gap-1 cursor-pointer font-bold border ${
              cameraActive 
                ? "bg-red-500 text-black border-red-400" 
                : "bg-brand-gold/10 text-brand-gold border-brand-gold/20 hover:bg-brand-gold hover:text-black"
            }`}
            title="Toggle Secure Bio Camera Diagnostics"
          >
            {cameraActive ? "📷 Off" : "📷 Camera"}
          </button>

          <button 
            id="astro-quick-btn"
            onClick={handleAstroTrigger}
            className="text-[9px] uppercase tracking-wider bg-brand-gold/10 text-brand-gold border border-brand-gold/20 hover:bg-brand-gold hover:text-black transition-all rounded-md px-2.5 py-1.5 font-space font-bold cursor-pointer"
          >
            🔮 Astrology
          </button>
        </div>
      </div>

      {/* Real Hardware Synapse & Permission Bridge */}
      <div className="bg-[#0b0b0c] border-b border-white/5 py-1.5 px-4 flex justify-between items-center text-[9px] text-gray-505 shrink-0">
        <button
          id="toggle-hardware-panel"
          type="button"
          onClick={() => setShowPermissions(!showPermissions)}
          className="hover:text-brand-gold transition duration-200 uppercase tracking-widest font-black flex items-center gap-1 cursor-pointer font-space text-[9px]"
        >
          <Settings className={`h-2.5 w-2.5 ${showPermissions ? "rotate-90 text-brand-gold" : ""}`} /> 
          Permission Synapses
        </button>

        <div className="flex items-center gap-2 font-mono text-[8px] text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Battery: <b className="text-white">{realBattery ? `${realBattery.level}%` : "100% AC"}</b></span>
        </div>
      </div>

      {showPermissions && (
        <div className="bg-[#0d0d0e] border-b border-white/5 p-3.5 shrink-0 transition-all text-xs text-gray-400 space-y-2.5 shadow-inner text-left">
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1 text-[10px]">
              <Shield className="h-3 w-3 text-brand-gold" /> System Permissions Pipeline
            </h4>
            <span className="text-[8px] font-mono text-brand-gold">Iframe secure</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="flex items-center gap-1 font-space text-[10px]"><Bell className="h-3 w-3 text-brand-gold" /> Notif Alerts</span>
              <button
                id="request-notif-perm-btn"
                type="button"
                onClick={requestNotifPermission}
                className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition cursor-pointer ${
                  notifPermission === "granted" ? "bg-green-950/40 text-green-400 border border-green-900/30" : "bg-brand-gold text-black"
                }`}
              >
                {notifPermission === "granted" ? "Active" : "Grant"}
              </button>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="flex items-center gap-1 font-space text-[10px]"><Mic className="h-3 w-3 text-brand-gold" /> Microphone</span>
              <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-1 bg-[#111112] text-brand-gold rounded border border-brand-gold/10 font-mono">
                {isListening ? "ACTIVE" : "STEADY"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-500">
            <div className="p-1 px-2 bg-white/5 rounded border border-white/5 flex justify-between">
              <span>Host RAM Size:</span>
              <span className="font-mono text-white font-bold">{realMemory ? `${realMemory} GB` : "8 GB"}</span>
            </div>
            <div className="p-1 px-2 bg-white/5 rounded border border-white/5 flex justify-between">
              <span>App Target Port:</span>
              <span className="font-mono text-brand-gold font-bold">PORT 3000</span>
            </div>
          </div>
        </div>
      )}

      {/* Selectors panel */}
      <div className="p-3 bg-[#09090a] border-b border-white/5 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between text-xs text-left">
          <span className="text-[8.5px] text-gray-500 uppercase tracking-widest font-bold">Cognitive Synapse Persona:</span>
          <span className="text-[11px] font-extrabold text-brand-gold uppercase tracking-wide">{personality}</span>
        </div>
        
        {/* Horizontal scrollable personality modes */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar shrink-0">
          {personalities.map((p) => {
            const IconComp = p.icon;
            const isSelected = personality === p.name;
            return (
              <button
                id={`personality-${p.name.replace(/\s+/g, '-').toLowerCase()}`}
                key={p.name}
                onClick={() => {
                  setPersonality(p.name);
                  onAddLog(`Sync: MJ persona switched to "${p.name}"`, "system", "UI-Control");
                  addBrainLog(`Synapse profile changed: ${p.name}`, "system");
                }}
                className={`flex items-center gap-1 py-1 px-3 rounded-full text-[10px] font-medium cursor-pointer transition-all duration-200 shrink-0 border ${
                  isSelected 
                    ? "bg-brand-gold/15 text-brand-gold border-brand-gold/30" 
                    : "bg-[#111112] text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
                }`}
                title={p.desc}
              >
                <IconComp className="h-3 w-3 shrink-0" />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tongue selection */}
        <div className="flex items-center gap-2 mt-0.5 shrink-0 text-left">
          <span className="text-[8.5px] text-gray-500 uppercase tracking-widest font-bold shrink-0">Tongue dialect:</span>
          <div className="flex flex-wrap gap-1">
            {languages.map((lng) => {
              const isSel = language === lng.val;
              return (
                <button
                  id={`lang-${lng.val.toLowerCase().replace(/\//g, '-')}`}
                  key={lng.val}
                  onClick={() => setLanguage(lng.val)}
                  className={`text-[8.5px] uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer transition-all border ${
                    isSel 
                      ? "bg-brand-gold/15 text-brand-gold border-brand-gold/25 font-bold" 
                      : "bg-[#111112] text-gray-400 border-white/5 hover:bg-white/5"
                  }`}
                >
                  {lng.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Camera Mirror Overlay */}
      {cameraActive && (
        <div id="interactive-cam-overlay" className="bg-[#0e0e11] border-b border-red-500/10 p-3 flex gap-3 items-center shrink-0 relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-red-500/40 pointer-events-none animate-pulse"></div>
          <div className="relative w-28 h-18 rounded-lg border border-white/10 overflow-hidden flex-shrink-0 bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <div className="absolute inset-0 border border-red-500/20 rounded-lg pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-red-500/30 rounded-full flex items-center justify-center animate-ping">
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <span className="font-space font-black text-red-500 uppercase tracking-wider text-[8px] flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-red-600 animate-ping"></span> Live Video scan
            </span>
            <p className="text-[10px] text-gray-300 font-serif leading-tight italic">
              "Tracking Team Mahakal biometric parameters. Visual sensory feedback pipeline is connected."
            </p>
          </div>
        </div>
      )}

      {/* Pure Voice-Only Central Cognitive Stage */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[#050505] relative overflow-hidden gap-5">
        
        {/* Dynamic Speech Wave Visualizer in deep background */}
        {(isSpeaking || isListening) && (
          <div className="absolute bottom-4 left-0 right-0 h-10 px-6 pointer-events-none text-center">
            <canvas ref={canvasRef} width="320" height="40" className="mx-auto bg-transparent w-[280px]" />
          </div>
        )}

        {/* Central Core Brain Glowing Auditory Orb */}
        <div className="relative flex items-center justify-center">
          
          {/* Ripple Ring 1 (Pulse under listening) */}
          {isListening && (
            <div className="absolute inset-0 w-36 h-36 rounded-full bg-red-500/15 animate-ping duration-1000"></div>
          )}
          {isSpeaking && (
            <div className="absolute inset-0 w-40 h-40 rounded-full bg-brand-gold/10 animate-ping duration-1000"></div>
          )}

          {/* Golden Ambient Breathe Aura */}
          <div className={`absolute rounded-full filter blur-[24px] pointer-events-none scale-90 transition-all duration-700 ${
            loading 
              ? "bg-brand-gold h-32 w-32 opacity-25 animate-pulse" 
              : isListening 
                ? "bg-red-500 h-32 w-32 opacity-20"
                : isSpeaking
                  ? "bg-brand-gold h-36 w-36 opacity-30 animate-pulse"
                  : "bg-brand-gold h-28 w-28 opacity-10 animate-pulse"
          }`} />

          {/* Real-time Dynamic Sound Ripple Rings */}
          {(isListening || isSpeaking) && (
            <>
              {/* Outer halo ring scaling on real time sound level */}
              <div 
                className={`absolute rounded-full border pointer-events-none transition-all duration-75 ${
                  isListening ? "border-red-500/30" : "border-brand-gold/30"
                }`}
                style={{
                  width: `${112 + soundLevel * 80}px`,
                  height: `${112 + soundLevel * 80}px`,
                  opacity: Math.max(0.1, 0.8 - soundLevel),
                  transform: 'scale(1)',
                }}
              />
              <div 
                className={`absolute rounded-full border pointer-events-none transition-all duration-100 ${
                  isListening ? "border-red-400/20" : "border-brand-gold/20"
                }`}
                style={{
                  width: `${112 + soundLevel * 140}px`,
                  height: `${112 + soundLevel * 140}px`,
                  opacity: Math.max(0.05, 0.5 - soundLevel * 0.8),
                  transform: 'scale(1)',
                }}
              />
              {/* Pulsating core glowing ring */}
              <div 
                className={`absolute rounded-full filter blur-[15px] pointer-events-none transition-all duration-100 ${
                  isListening ? "bg-red-500/25" : "bg-brand-gold/25"
                }`}
                style={{
                  width: `${112 + soundLevel * 60}px`,
                  height: `${112 + soundLevel * 60}px`,
                }}
              />
            </>
          )}

          {/* Actual clickable interactive brain Orb */}
          <button
            id="vocal-brain-orb"
            onClick={toggleSpeechListen}
            className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-105 border focus:outline-none shadow-2xl ${
              loading 
                ? "bg-gradient-to-tr from-[#161617] to-brand-gold/20 border-brand-gold/40 scale-105 animate-pulse" 
                : isListening 
                  ? "bg-gradient-to-tr from-[#120505] to-red-500/20 border-red-500/50"
                  : isSpeaking
                    ? "bg-gradient-to-tr from-[#181510] to-brand-gold/30 border-brand-gold/60"
                    : "bg-gradient-to-tr from-black to-[#131315] border-white/10 hover:border-brand-gold/40 hover:shadow-brand-gold/5"
            }`}
            style={{
              transform: (isListening || isSpeaking) ? `scale(${1.08 + soundLevel * 0.15})` : undefined,
              boxShadow: (isListening || isSpeaking) 
                ? `0 0 ${20 + soundLevel * 45}px ${isListening ? "rgba(239, 68, 68, 0.45)" : "rgba(212, 175, 55, 0.45)"}`
                : undefined
            }}
          >
            {loading ? (
              <RefreshCw className="h-8 w-8 text-brand-gold animate-spin" />
            ) : isListening ? (
              <Mic className="h-8 w-8 text-red-400 animate-pulse" />
            ) : isSpeaking ? (
              <Sparkles className="h-8 w-8 text-brand-gold animate-bounce" />
            ) : (
              <Mic className="h-8 w-8 text-gray-400 transition hover:text-brand-gold" />
            )}
            
            <span className="text-[7.5px] font-space font-black tracking-widest uppercase mt-1.5 font-sans">
              {loading 
                ? "THINKING" 
                : isListening 
                  ? "LISTENING" 
                  : isSpeaking 
                    ? "TALKING" 
                    : "HANDS-FREE ON"}
            </span>
          </button>
        </div>

        {/* Cognitive Synaptic Transcript Subtitles */}
        <div className="w-full max-w-[340px] space-y-2.5 text-center z-10">
          
          {/* User's recent spoken transcript */}
          {userTranscript && (
            <div className="bg-[#111112]/40 border border-white/5 py-1 px-3 rounded-xl inline-block max-w-[280px]">
              <p className="text-[10px] text-gray-500 font-mono tracking-wide truncate">
                🗣️ <span className="text-gray-300 font-sans italic">"{userTranscript}"</span>
              </p>
            </div>
          )}

          {/* MJ's vocal response box */}
          <div className="min-h-[60px] flex items-center justify-center py-1 bg-white/5 px-2 rounded-2xl border border-white/5">
            <p className="text-xs sm:text-sm text-gray-100 font-serif leading-relaxed italic px-2">
              "{mjSpeechText}"
            </p>
          </div>
          
          {isSpeaking && (
            <button
              id="vocal-stop-speaking-btn"
              onClick={stopSpeaking}
              className="text-[8.5px] uppercase font-bold tracking-wider bg-red-950/20 hover:bg-red-950 text-red-400 px-3 py-1 rounded-md border border-red-900/35 transition cursor-pointer"
            >
              Mute Speech Response
            </button>
          )}
        </div>

      </div>



      {/* Real Quick Voice Commands - Instant Testing Fallback Grid */}
      <div className="bg-[#111112] p-3 border-t border-white/5 shrink-0 text-left">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[8px] uppercase tracking-widest font-extrabold text-brand-gold font-space">Quick Simulated Vocal Synapse Triggers</span>
          <span className="text-[7.5px] text-gray-500 font-mono">Bypasses Mic constraints</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 max-h-[110px] overflow-y-auto custom-scrollbar">
          {quickTriggers.map((t, idx) => {
            const Icon = t.icon;
            return (
              <button
                id={`vocal-trigger-${idx}`}
                key={idx}
                onClick={() => handleQuickTrigger(t.cmd)}
                className={`flex items-center gap-1.5 p-1.5 bg-[#050505] border border-white/5 rounded-lg text-left text-[9.5px] text-gray-300 hover:text-brand-gold transition duration-200 cursor-pointer ${t.color}`}
              >
                <Icon className="h-3 w-3 text-brand-gold shrink-0" />
                <span className="truncate font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
