import React from 'react';
import { Department } from '../types';
import { Users, Award, BookOpen, Clock, ArrowRight, DollarSign } from 'lucide-react';

interface DepartmentCardProps {
  department: Department;
  onApply: (dept: Department) => void;
  onViewDetails: (dept: Department) => void;
  userApplied?: boolean;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onApply,
  onViewDetails,
  userApplied
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group flex flex-col justify-between">
      <div>
        {/* Cover Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={department.coverImage}
            alt={department.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

          {/* Code Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur border border-slate-700/80 text-white font-mono text-xs font-bold tracking-wider">
            {department.code}
          </span>

          {/* Category Tag */}
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur text-white text-xs font-semibold shadow-md">
            {department.category}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
              {department.name}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {department.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Total Seats</span>
                <span className="font-bold text-slate-200">
                  {department.availableSeats} / {department.totalSeats} Left
                </span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Eligibility</span>
                <span className="font-bold text-emerald-400">
                  Min {department.eligibilityPercentage}%
                </span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Duration</span>
                <span className="font-bold text-slate-200">
                  {department.durationYears} Years
                </span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Fee/Semester</span>
                <span className="font-bold text-slate-200">
                  ${department.feePerSemester}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center gap-2 border-t border-slate-800/80">
        <button
          onClick={() => onViewDetails(department)}
          className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors border border-slate-700/60"
        >
          View Details
        </button>

        <button
          onClick={() => onApply(department)}
          disabled={userApplied || department.availableSeats <= 0}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
            userApplied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
              : department.availableSeats <= 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {userApplied ? (
            'Applied'
          ) : department.availableSeats <= 0 ? (
            'Seats Full'
          ) : (
            <>
              Apply Now <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
