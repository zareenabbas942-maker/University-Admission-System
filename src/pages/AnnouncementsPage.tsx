import React from 'react';
import { Announcement } from '../types';
import { BellRing, Calendar, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface AnnouncementsPageProps {
  announcements: Announcement[];
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ announcements }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <BellRing className="w-4 h-4" /> Official Notifications
        </div>
        <h1 className="text-3xl font-black text-white">University Announcements & Deadlines</h1>
        <p className="text-slate-400 text-sm mt-1">
          Stay informed with important updates regarding Fall 2026 admissions, merit lists, and scholarship tests.
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann._id}
            className={`p-6 rounded-2xl border shadow-xl transition-all space-y-3 ${
              ann.isImportant
                ? 'bg-slate-900 border-amber-500/30 ring-1 ring-amber-500/20'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                ann.isImportant
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}>
                {ann.category}
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> {ann.date}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white leading-tight">{ann.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{ann.content}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
