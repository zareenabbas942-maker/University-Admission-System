import React, { useState } from 'react';
import { HeroSlider } from '../components/HeroSlider';
import { DepartmentCard } from '../components/DepartmentCard';
import { Department, Application, Announcement } from '../types';
import { BookOpen, Award, CheckCircle2, UserCheck, Search, Filter, Sparkles, ArrowRight, BellRing, Calendar } from 'lucide-react';

interface HomePageProps {
  departments: Department[];
  myApplications: Application[];
  announcements: Announcement[];
  onApplyDepartment: (dept: Department) => void;
  onViewDepartmentDetails: (dept: Department) => void;
  onNavigate: (tab: string) => void;
  openCalculator: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  departments,
  myApplications,
  announcements,
  onApplyDepartment,
  onViewDepartmentDetails,
  onNavigate,
  openCalculator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Computer Science', 'Engineering', 'Business', 'Medical'];

  const filteredDepartments = departments.filter((dept) => {
    const matchesCategory = selectedCategory === 'All' || dept.category === selectedCategory;
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dept.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const appliedDepartmentIds = new Set(myApplications.map((a) => a.departmentId));

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Carousel */}
      <HeroSlider
        onApplyClick={() => onNavigate('departments')}
        onMeritClick={() => onNavigate('merit-lists')}
        onCalculatorClick={openCalculator}
      />

      {/* Announcements Banner Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Latest Admission Notice
              </span>
              <p className="text-sm font-semibold text-white truncate max-w-xl">
                {announcements.length > 0 ? announcements[0].title : 'Fall 2026 Admissions Open. Apply Online.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('announcements')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
          >
            View All Notices <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Admission Process Stepper */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            Simple 4-Step Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">How To Apply Online</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Follow these streamlined steps to complete your admission application and verify merit status.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Create Account',
              desc: 'Sign up on student portal with CNIC & academic contact info.',
              icon: UserCheck,
              color: 'from-blue-600 to-indigo-600'
            },
            {
              step: '02',
              title: 'Enter Academic Marks',
              desc: 'Input Matriculation & FSc / Intermediate marks in profile.',
              icon: BookOpen,
              color: 'from-indigo-600 to-violet-600'
            },
            {
              step: '03',
              title: 'Select Program',
              desc: 'Browse departments and apply for multiple BS/MBBS programs.',
              icon: Sparkles,
              color: 'from-violet-600 to-purple-600'
            },
            {
              step: '04',
              title: 'Merit & Challan',
              desc: 'Track merit rank, download fee challan, and confirm seat.',
              icon: Award,
              color: 'from-emerald-600 to-teal-600'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-800 group-hover:text-slate-700 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Departments & Program Finder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Academic Offerings
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Explore Departments & Seats
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Find eligible degree programs, tuition fees, and available seats.
            </p>
          </div>

          <button
            onClick={() => onNavigate('departments')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 self-start md:self-auto shadow-md shadow-indigo-600/30"
          >
            Browse All Departments <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by department name or code (e.g., BSCS, AI, MBBS)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <DepartmentCard
              key={dept._id}
              department={dept}
              onApply={onApplyDepartment}
              onViewDetails={onViewDepartmentDetails}
              userApplied={appliedDepartmentIds.has(dept._id)}
            />
          ))}
        </div>
      </section>

      {/* Aggregate Calculator CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 border border-indigo-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/40">
              Instant Merit Eligibility Check
            </span>
            <h2 className="text-3xl font-black text-white leading-tight">
              Calculate Your Aggregate Percentage in Seconds
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Test your admission eligibility against official HEC weighting formulas (30% Matric + 70% FSc) and see which department seats you qualify for!
            </p>
          </div>

          <button
            onClick={openCalculator}
            className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/30 flex items-center gap-2 transform hover:scale-105 transition-all z-10 shrink-0"
          >
            Launch Aggregate Calculator
            <Sparkles className="w-5 h-5 text-slate-950" />
          </button>
        </div>
      </section>

    </div>
  );
};
