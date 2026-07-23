import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Award, Calendar, CheckCircle2, Calculator, BookOpen } from 'lucide-react';

interface HeroSliderProps {
  onApplyClick: () => void;
  onMeritClick: () => void;
  onCalculatorClick: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onApplyClick,
  onMeritClick,
  onCalculatorClick
}) => {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1600',
      badge: 'Fall 2026 Admissions Open',
      title: 'Shape Your Future at Pakistan\'s Premier Academic Institute',
      subtitle: 'Admissions are officially open for BS Computer Science, AI, Electrical Engineering, Business & MBBS.',
      stats: [
        { label: 'PEC & HEC Accredited', value: 'Top 10 Rank' },
        { label: 'Scholarships Available', value: 'Up to 100%' },
        { label: 'Employment Rate', value: '96.4%' }
      ]
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600',
      badge: 'Merit List Released',
      title: 'First Official Merit Lists for BSCS & BSAI Now Live',
      subtitle: 'Check your aggregate ranking, download bank fee challan, and confirm your admission online.',
      stats: [
        { label: 'First Merit Cutoff', value: '88.4%' },
        { label: 'Available Seats', value: '350+' },
        { label: 'Fee Deadline', value: 'Aug 05, 2026' }
      ]
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600',
      badge: 'State-of-the-Art Research Labs',
      title: 'Industry-Focused Curriculum with AI & Robotics Facilities',
      subtitle: 'Learn from PhD faculty, participate in global hackathons, and connect with top tech recruiters.',
      stats: [
        { label: 'Research Publications', value: '1,200+' },
        { label: 'Global Campus Partners', value: '45 Universities' },
        { label: 'Student Clubs', value: '30+' }
      ]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentIndex];

  return (
    <div className="relative w-full h-[540px] md:h-[600px] bg-slate-950 overflow-hidden shadow-2xl">
      {/* Slide Image Background with Subtle Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Calendar className="w-4 h-4 text-emerald-400" />
            {current.badge}
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {current.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {current.subtitle}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-apply-btn"
              onClick={onApplyClick}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              Apply For Admission 2026
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-merit-btn"
              onClick={onMeritClick}
              className="px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all backdrop-blur"
            >
              <Award className="w-4 h-4 text-amber-400" />
              View Merit Lists
            </button>

            <button
              id="hero-calc-btn"
              onClick={onCalculatorClick}
              className="px-4 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold text-sm flex items-center gap-2 transition-all backdrop-blur"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              Aggregate Calculator
            </button>
          </div>

          {/* Highlight Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 max-w-lg">
            {current.stats.map((st, i) => (
              <div key={i} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                <p className="text-xs text-slate-400 font-medium truncate">{st.label}</p>
                <p className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5">{st.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white border border-slate-700/50 backdrop-blur transition-all"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white border border-slate-700/50 backdrop-blur transition-all"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-indigo-500' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
