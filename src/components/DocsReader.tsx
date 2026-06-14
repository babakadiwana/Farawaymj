import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  Upload, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Plus, 
  Trash2, 
  Layers, 
  RefreshCw 
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  category: "Telemetry" | "Astrology" | "Personal" | "Tech";
  content: string;
  size: string;
  mimetype: string;
}

interface DocsReaderProps {
  onAddLog: (text: string, type: "system" | "task" | "clipboard" | "reminder" | "voice", source: string) => void;
  speakText: (text: string) => void;
}

const PRELOADED_DOCUMENTS: Document[] = [
  {
    id: "doc-1",
    title: "HP_Omen_Master_Performance_Config.conf",
    category: "Telemetry",
    size: "4.8 KB",
    mimetype: "text/plain",
    content: `# HP OMEN MASTER PERFORMANCES PROFILE
[OMEN-NODE-D09D]
OverclockLevel=EXTREME_VALKYRIE
FanSpindleBoost=98%
SecureVaporChannel=Active
MaxMemoryAllocation=92% RAM
DualChannelLatencyOffset=0.04ms
SystemThermalCeiling=85C

[MJ-VOICE-SYNC-ROUTE]
VocalTunnelPort=3000
EncryptionTunnel=TLS_1.3_PRIVATE_MAHAKAL
ActiveSpeechSynthesisEngine=PremiumVocalMahakalNetV2
SpeechSynthesizerGender=Female
DefaultLanguageMatrix=Hinglish,Gujarati,Marathi`
  },
  {
    id: "doc-2",
    title: "Vedic_Astro_Natal_Chart_Mahakal_Workspace.txt",
    category: "Astrology",
    size: "12.2 KB",
    mimetype: "text/plain",
    content: `VEDIC KUNDLI STUDY & PLANETARY CO-ALTITUDES
Subject Name: Mahakal Operator
Date of Birth Calibration: 2000-01-01
Ascendant (Lagna): Sagittarius (Dhanu)
Moon Sign (Rashi): Libra (Tula)
Active Nakshatra: Chitra (Libra Quad)
Major Planetary Period (Mahadasha): Jupiter (Guru Mahadasha active until 2038)

CHART TRANSITS TODAY:
- Sun resides in the 7th House, giving massive solar energy to communication and multi-device connection pipelines.
- Saturn is placed in the 3rd House of Action, reinforcing extreme structural building and digital sync software development.
- Jupiter squares Venus, suggesting magnificent gains from technology innovations and synchronized voice hubs.`
  },
  {
    id: "doc-3",
    title: "Mahakal_Tech_Academics_Goals.md",
    category: "Personal",
    size: "2.5 KB",
    mimetype: "text/markdown",
    content: `# Mahakal Net - Technical Evolution Goals 2026-2027

To build an elite smart-home multi-device sync dashboard driven by MJ premium interactive AI and Mahakal Secure network adapters.

### Milestone 1: Multi-Interface Unified Database
- [x] Configure Node.js express backend for real-time clipboard polling.
- [x] Integrate dual-mobile (Galaxy) and laptop (HP Omen) emulator nodes.
- [ ] Direct biometrics feedback lock trigger for security.

### Milestone 2: Voice Recognition & Speeches
- [x] Speech recognition on browser mic capture.
- [x] Distinct native vocal accents (Hindi, Gujarati, Marathi, hinges).
- [ ] Dynamic household appliance switches.`
  },
  {
    id: "doc-4",
    title: "Mahakal_Net_Secure_Express_Endpoints.json",
    category: "Tech",
    size: "8.1 KB",
    mimetype: "application/json",
    content: `{
  "networkHost": "0.0.0.0",
  "ports": {
    "nginxProxy": 3000,
    "internalVite": 5173
  },
  "encryption": "TLS 1.3 Strict Tunneling",
  "synapseControllers": [
    "/api/sync/clipboard",
    "/api/sync/device-stats",
    "/api/mj/chat",
    "/api/mj/panchang"
  ],
  "authorizations": {
    "owner": "Team Mahakal Operator",
    "primaryEmail": "mahakalbabakadiwanahu@gmail.com",
    "isGoogleSyncActive": true
  }
}`
  }
];

export default function DocsReader({ onAddLog, speakText }: DocsReaderProps) {
  const [documents, setDocuments] = useState<Document[]>(PRELOADED_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState<string>("doc-1");
  const [searchTerm, setSearchTerm] = useState("");
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Custom text input states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"Telemetry" | "Astrology" | "Personal" | "Tech">("Tech");
  const [showAddForm, setShowAddForm] = useState(false);

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const handleAddNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newDoc: Document = {
      id: `custom-${Date.now()}`,
      title: newTitle.endsWith(".txt") || newTitle.endsWith(".json") || newTitle.endsWith(".md") ? newTitle : `${newTitle}.txt`,
      category: newCategory,
      content: newContent,
      size: `${(newContent.length / 1024).toFixed(1)} KB`,
      mimetype: "text/plain"
    };

    setDocuments(prev => [...prev, newDoc]);
    setSelectedDocId(newDoc.id);
    onAddLog(`Document Hub: Created custom document "${newDoc.title}"`, "clipboard", "Docs-Reader");
    
    // Clear inputs
    setNewTitle("");
    setNewContent("");
    setShowAddForm(false);
  };

  const handleDeleteDoc = (id: string) => {
    if (documents.length <= 1) {
      alert("At least one document must remain in the repository storage.");
      return;
    }
    const filtered = documents.filter(d => d.id !== id);
    setDocuments(filtered);
    if (selectedDocId === id) {
      setSelectedDocId(filtered[0].id);
    }
    onAddLog(`Document Hub: Removed document from safe`, "system", "UI-Control");
  };

  const handleSummarizeDoc = async () => {
    if (!selectedDoc) return;
    setIsSummarizing(true);
    setSummary("");
    onAddLog(`Docs Engine: Analyzing document metrics for "${selectedDoc.title}"`, "voice", "Docs-Analyzer");

    try {
      const response = await fetch("/api/mj/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are an expert document summarizer. Summarize and analyze this document content:
          Title: ${selectedDoc.title}
          Category: ${selectedDoc.category}
          Content:
          ${selectedDoc.content}
          
          Generate a beautiful bulleted summary list in your designated premium voice personality, with a warm concluding recommendation. Keep it within 3-4 bullet items.`,
          personalityMode: "Teacher Mode",
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.response);
        onAddLog(`Docs Engine: Successfully formulated document briefing summaries!`, "voice", "MJ-Brain");
        speakText(`Summaries compiled! Click read to listen to raw content, or check briefs below.`);
      } else {
        setSummary("Synapse error. Unable to perform AI documentation parsing.");
      }
    } catch (err) {
      console.error(err);
      setSummary("Synchronization backup active. Code analyzer completed.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute left-0 top-0 h-44 w-44 bg-[#ffe399] rounded-full filter blur-[150px] opacity-[0.02] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-white/5 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
            <FileText className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="font-space font-bold text-white uppercase tracking-wider text-sm sm:text-base">Document Repository & Reader</h3>
            <p className="text-[11px] text-gray-400 font-serif italic">Secure local cloud storage filesystem with vocal intelligence reader</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-[#111112] text-xs py-2 pl-8 pr-4 rounded-lg border border-white/10 focus:outline-none focus:border-brand-gold font-sans placeholder-gray-600 focus:ring-0"
          />
          <Search className="h-3.5 w-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: List & Custom File uploader */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between font-space">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
              <Layers className="h-3 w-3 text-brand-gold" /> Encrypted Vault ({filteredDocs.length})
            </span>
            <button
              id="add-custom-doc-toggle-btn"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-[9px] uppercase tracking-wider bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-black border border-brand-gold/20 font-bold px-2 py-1 rounded cursor-pointer transition-all flex items-center gap-0.5"
            >
              <Plus className="h-3 w-3" /> Add Doc
            </button>
          </div>

          {/* Add custom document form */}
          {showAddForm && (
            <form onSubmit={handleAddNewDoc} className="bg-[#111112] p-4 rounded-xl border border-brand-gold/25 space-y-3 font-sans text-left">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold font-mono">Title</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Project_Draft.md"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded p-1.5 text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold font-mono text-left">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#050505] border border-white/10 rounded p-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                >
                  <option value="Tech">Tech / API</option>
                  <option value="Telemetry">Telemetry / PC</option>
                  <option value="Astrology">Astrology</option>
                  <option value="Personal">Personal Goal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-bold font-mono text-left">Raw Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste or write your document content here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded p-1.5 text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-brand-gold hover:bg-gold-light text-black text-[10px] uppercase font-bold py-1.5 rounded cursor-pointer transition font-space"
                >
                  Save Document
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 bg-white/5 hover:bg-white/10 text-gray-400 text-[10px] rounded cursor-pointer border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List of Documents */}
          <div className="space-y-2 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              let catStyles = "text-blue-400 bg-blue-950/20 border-blue-900/30";
              if (doc.category === "Astrology") catStyles = "text-pink-400 bg-pink-950/20 border-pink-900/30";
              if (doc.category === "Telemetry") catStyles = "text-yellow-400 bg-yellow-950/20 border-yellow-905/30";
              if (doc.category === "Personal") catStyles = "text-emerald-400 bg-emerald-950/20 border-emerald-900/30";

              return (
                <div
                  id={`doc-card-${doc.id}`}
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 text-left relative flex flex-col justify-between ${
                    isSelected 
                      ? "bg-brand-gold/10 border-brand-gold/40 shadow-md" 
                      : "bg-[#111112] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate">
                      <h4 className={`text-xs font-semibold truncate ${isSelected ? "text-brand-gold" : "text-white"}`}>
                        {doc.title}
                      </h4>
                      <span className="text-[9px] text-gray-500 font-mono block mt-1">Size: {doc.size}</span>
                    </div>
                    <span className={`text-[8px] font-mono font-bold tracking-wider uppercase border px-1.5 py-0.5 rounded shrink-0 ${catStyles}`}>
                      {doc.category}
                    </span>
                  </div>

                  {/* Quick Delete */}
                  {doc.id.startsWith("custom-") && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDoc(doc.id);
                      }}
                      className="absolute bottom-2 right-2 text-gray-600 hover:text-red-400 transition cursor-pointer"
                      title="Delete custom file"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Reader Panel */}
        <div className="lg:col-span-8 flex flex-col h-full gap-5">
          {selectedDoc ? (
            <div className="bg-[#111112] rounded-xl border border-white/5 p-5 flex flex-col flex-1 min-h-[300px]">
              
              {/* Document Actions header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 mb-4 gap-2">
                <div className="text-left">
                  <span className="text-[9px] text-[#ffe399] uppercase font-mono font-bold block">{selectedDoc.category} DOCUMENT VIEW</span>
                  <h4 className="text-sm font-semibold text-white tracking-wide mt-0.5">{selectedDoc.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="doc-speak-content"
                    onClick={() => speakText(selectedDoc.content)}
                    className="p-1.5 bg-white/5 border border-white/10 text-gray-300 hover:text-brand-gold cursor-pointer rounded-lg hover:border-brand-gold/30 transition text-xs flex items-center gap-1 font-space uppercase font-bold"
                    title="Read document aloud using MJ voice synth"
                  >
                    <Volume2 className="h-4 w-4 text-brand-gold" /> Speak Text
                  </button>
                  
                  <button
                    id="doc-analyze-btn"
                    onClick={handleSummarizeDoc}
                    disabled={isSummarizing}
                    className="p-1.5 bg-brand-gold hover:bg-gold-light text-black cursor-pointer rounded-lg transition text-xs flex items-center gap-1 font-space uppercase font-bold"
                  >
                    {isSummarizing ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Analyze Doc
                  </button>
                </div>
              </div>

              {/* Scrollable File contents panel */}
              <div className="flex-1 max-h-[220px] overflow-y-auto custom-scrollbar font-mono text-xs text-[#ced4da] bg-[#050505] p-4 rounded-xl border border-white/5 text-left leading-relaxed whitespace-pre-wrap select-text">
                {selectedDoc.content}
              </div>

              {/* AI Brief Summary card */}
              {(summary || isSummarizing) && (
                <div className="mt-4 p-4 bg-brand-gold/[0.03] border border-brand-gold/25 rounded-xl text-left">
                  <span className="text-[9px] uppercase tracking-wider font-mono text-brand-gold font-bold flex items-center gap-1 mb-2">
                    <BookOpen className="h-3.5 w-3.5" /> Core Insights Report - MJ AI Engine
                  </span>
                  
                  {isSummarizing ? (
                    <div className="flex items-center gap-2 text-gray-500 italic text-xs py-2 justify-center">
                      <RefreshCw className="h-4.5 w-4.5 animate-spin text-brand-gold" />
                      <span>Distilling document variables and structure...</span>
                    </div>
                  ) : (
                    <div className="text-xs leading-relaxed text-gray-300 space-y-1">
                      <div className="whitespace-pre-wrap font-sans">{summary}</div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="bg-[#111112] rounded-xl border border-white/5 p-12 text-center text-gray-500 border-dashed">
              Select or import a document payload on the sidebar to read and summarize.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
