import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Globe, Facebook, Twitter, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  openCalculator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openCalculator }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: University Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Apex University
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chartered by HEC & PEC. Committed to producing visionary leaders in artificial intelligence, engineering, medicine, and business.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Portal Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-indigo-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('departments')} className="hover:text-indigo-400 transition-colors">
                  Academic Departments & Seats
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('merit-lists')} className="hover:text-indigo-400 transition-colors">
                  Published Merit Lists
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('announcements')} className="hover:text-indigo-400 transition-colors">
                  Admission Announcements
                </button>
              </li>
              <li>
                <button onClick={openCalculator} className="hover:text-emerald-400 transition-colors font-medium text-emerald-400 flex items-center gap-1">
                  Aggregate Formula Calculator <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Programs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Offered Degree Programs</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="text-slate-300">BS Computer Science (BSCS)</li>
              <li className="text-slate-300">BS Artificial Intelligence (BSAI)</li>
              <li className="text-slate-300">BS Electrical Engineering (BSEE)</li>
              <li className="text-slate-300">Bachelor of Business Admin (BBA)</li>
              <li className="text-slate-300">Medicine & Surgery (MBBS)</li>
              <li className="text-slate-300">BS Cyber Security (BSCYBER)</li>
            </ul>
          </div>

          {/* Col 4: Admission Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Admissions Secretariat</h4>
            
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Main University Avenue, Knowledge City Phase 1, Lahore, Pakistan</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+92 (42) 111-APEX-UNI (2739)</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>admissions@apex.edu.pk</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Globe className="w-4 h-4 text-teal-400 shrink-0" />
              <span>www.apex.edu.pk</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Apex University Admissions Office. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Admission</a>
            <a href="#" className="hover:text-slate-300">Fee Structure PDF</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
