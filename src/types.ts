export interface Task {
  id: string;
  text: string;
  completed: boolean;
  deviceSource: string;
  updatedAt: number;
}

export interface Reminder {
  id: string;
  text: string;
  time: string;
  completed: boolean;
  deviceSource: string;
  updatedAt: number;
}

export interface ClipboardClip {
  id: string;
  text: string;
  deviceSource: string;
  timestamp: number;
}

export interface SyncLog {
  id: string;
  text: string;
  type: "system" | "task" | "clipboard" | "reminder" | "voice";
  deviceSource: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "mj";
  text: string;
  timestamp: number;
  voiceUrl?: string;
  language?: string;
}
