import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Calendar, 
  Bell, 
  Cpu, 
  CheckSquare, 
  Square,
  AlertCircle
} from "lucide-react";
import { Task, Reminder } from "../types";

interface ActionCenterProps {
  tasks: Task[];
  reminders: Reminder[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string, completed: boolean) => void;
  onDeleteTask: (id: string) => void;
  onAddReminder: (text: string, time: string) => void;
  onDeleteReminder: (id: string) => void;
  onAddLog: (text: string, type: "system" | "task" | "clipboard" | "reminder" | "voice", source: string) => void;
}

export default function ActionCenterBoard({
  tasks,
  reminders,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddReminder,
  onDeleteReminder,
  onAddLog
}: ActionCenterProps) {
  const [taskText, setTaskText] = useState("");
  const [reminderText, setReminderText] = useState("");
  const [reminderTime, setReminderTime] = useState("09:00");

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    onAddTask(taskText.trim());
    onAddLog(`Created Workspace Task: "${taskText.trim()}"`, "task", "Chamber-Control-Panel");
    setTaskText("");
  };

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderText.trim()) return;
    onAddReminder(reminderText.trim(), reminderTime);
    onAddLog(`Scheduled Team Alarm: "${reminderText.trim()}" at ${reminderTime}`, "reminder", "Alarm-Grid");
    setReminderText("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
      
      {/* SECTOR A: ACTIVE TEAM TASK SANCTUM */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden hover:border-brand-gold/10 transition duration-300">
        <div className="absolute right-0 top-0 h-24 w-24 bg-brand-gold rounded-full filter blur-[80px] opacity-[0.015] pointer-events-none"></div>

        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-xl">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="font-space font-bold text-white uppercase tracking-wider text-sm">Active Command Tasks</h4>
              <p className="text-[10px] font-mono text-gray-500 uppercase">Synchronized across active nodes & MJ independent brain</p>
            </div>
          </div>
          <span className="text-[9px] font-mono bg-brand-gold/15 text-brand-gold px-2 py-0.5 border border-brand-gold/20 rounded font-bold uppercase tracking-wider">
            Total: {tasks.length}
          </span>
        </div>

        {/* Form to submit direct tasks */}
        <form onSubmit={handleTaskSubmit} className="flex gap-2 mb-4">
          <input
            id="task-input-field"
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Commit new operational task to database..."
            className="flex-1 bg-white/5 border border-white/10 hover:border-brand-gold/20 focus:border-brand-gold focus:outline-none rounded-xl text-xs py-2.5 px-3.5 text-white placeholder-gray-500 font-sans transition"
          />
          <button
            id="add-task-btn"
            type="submit"
            className="p-2.5 bg-brand-gold hover:bg-gold-light text-black transition rounded-xl flex items-center justify-center cursor-pointer shadow-md focus:outline-none"
            title="Create task"
          >
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          </button>
        </form>

        {/* Task lists overflow viewport */}
        <div className="space-y-2 max-h-[290px] overflow-y-auto custom-scrollbar pr-1">
          {tasks.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed border-white/5 bg-[#111112]/30">
              <AlertCircle className="h-7 w-7 text-gray-600 mx-auto mb-2 animate-pulse" />
              <p className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">Zero pending operational tasks</p>
              <p className="text-[10px] text-gray-600 mt-1">MJ Voice commands can commit tasks stream-ready anytime</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all duration-300 ${
                  task.completed 
                    ? "bg-[#111112]/20 border-white/5 opacity-55" 
                    : "bg-[#111112] border-white/5 hover:border-brand-gold/15"
                }`}
              >
                <button
                  id={`toggle-task-${task.id}`}
                  onClick={() => {
                    onToggleTask(task.id, !task.completed);
                    onAddLog(`Toggled task "${task.text}": ${!task.completed ? "COMPLETED" : "ACTIVE"}`, "task", "Task-Grid");
                  }}
                  className="text-gray-400 hover:text-brand-gold transition cursor-pointer flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckSquare className="h-4.5 w-4.5 text-brand-gold" />
                  ) : (
                    <Square className="h-4.5 w-4.5 hover:text-brand-gold" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs text-white truncate ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded uppercase font-semibold">
                      {task.deviceSource || "Chamber"}
                    </span>
                    <span className="text-[8px] font-mono text-gray-600">
                      {new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <button
                  id={`delete-task-${task.id}`}
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 px-1.5 rounded-md hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition cursor-pointer flex-shrink-0"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTOR B: ALARMS & TIME-SENSITIVE REMINDERS */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden hover:border-brand-gold/10 transition duration-300">
        <div className="absolute right-0 top-0 h-24 w-24 bg-brand-gold rounded-full filter blur-[80px] opacity-[0.015] pointer-events-none"></div>

        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-xl">
              <Bell className="h-4.5 w-4.5 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <h4 className="font-space font-bold text-white uppercase tracking-wider text-sm">Synchronized Daily Alarms</h4>
              <p className="text-[10px] font-mono text-gray-500 uppercase">Interactive alarm schedulers bridged with speaker terminals</p>
            </div>
          </div>
          <span className="text-[9px] font-mono bg-brand-gold/15 text-brand-gold px-2 py-0.5 border border-brand-gold/20 rounded font-bold uppercase tracking-wider">
            Active: {reminders.length}
          </span>
        </div>

        {/* Input Form for Real Alarms */}
        <form onSubmit={handleReminderSubmit} className="flex gap-2 mb-4">
          <input
            id="alarm-text-input"
            type="text"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            placeholder="Alarm focus label (e.g. Code Review)..."
            required
            className="flex-1 bg-white/5 border border-white/10 hover:border-brand-gold/20 focus:border-brand-gold focus:outline-none rounded-xl text-xs py-2.5 px-3 text-white transition"
          />
          <input
            id="alarm-time-input"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="bg-white/5 border border-white/10 text-white rounded-xl text-xs px-2 py-2.5 font-mono focus:border-brand-gold focus:outline-none w-[75px]"
          />
          <button
            id="add-alarm-btn"
            type="submit"
            className="p-2.5 bg-brand-gold hover:bg-gold-light text-black transition rounded-xl flex items-center justify-center cursor-pointer shadow-md focus:outline-none"
            title="Add Alarm"
          >
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          </button>
        </form>

        {/* Alarm entries */}
        <div className="space-y-2 max-h-[290px] overflow-y-auto custom-scrollbar pr-1">
          {reminders.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed border-white/5 bg-[#111112]/30">
              <Bell className="h-7 w-7 text-gray-600 mx-auto mb-2 opacity-50" />
              <p className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">No alarms active</p>
              <p className="text-[10px] text-gray-650 mt-1">Ready to sync team schedules across laptop and mobile nodes</p>
            </div>
          ) : (
            reminders.map((rem) => (
              <div 
                key={rem.id}
                className="p-3 bg-[#111112] border border-white/5 hover:border-brand-gold/15 rounded-xl flex items-center justify-between gap-3 transition-all duration-300"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-brand-gold/5 text-brand-gold rounded-lg border border-brand-gold/10 font-mono text-xs font-bold shrink-0">
                    {rem.time}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white font-medium truncate">
                      {rem.text}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[8px] font-mono bg-white/5 text-gray-500 px-1.5 py-0.2 rounded uppercase">
                        {rem.deviceSource || "Command"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
                  <button
                    id={`delete-reminder-${rem.id}`}
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-1 px-1.5 rounded-md hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition cursor-pointer free-shrink"
                    title="Delete alarm"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
