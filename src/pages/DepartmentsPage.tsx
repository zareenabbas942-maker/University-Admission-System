import React, { useState } from 'react';
import { Department, Application } from '../types';
import { DepartmentCard } from '../components/DepartmentCard';
import { Search, Building2, Plus, X, Users, Award, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DepartmentsPageProps {
  departments: Department[];
  myApplications: Application[];
  onApplyDepartment: (dept: Department) => void;
  onAddDepartmentAdmin?: () => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  departments,
  myApplications,
  onApplyDepartment,
  onAddDepartmentAdmin
}) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDeptDetail, setSelectedDeptDetail] = useState<Department | null>(null);

  const categories = ['All', 'Computer Science', 'Engineering', 'Business', 'Medical'];

  const filtered = departments.filter((dept) => {
    const matchesCategory = selectedCategory === 'All' || dept.category === selectedCategory;
    const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dept.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const appliedDeptIds = new Set(myApplications.map((a) => a.departmentId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> Academic Departments & Seat Allocations
          </div>
          <h1 className="text-3xl font-black text-white">Explore Offered Degree Programs</h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse PEC & HEC recognized undergraduate degree programs for Fall 2026.
          </p>
        </div>

        {user?.role === 'admin' && onAddDepartmentAdmin && (
          <button
            onClick={onAddDepartmentAdmin}
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New Department
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search degree title or code..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dept) => (
          <DepartmentCard
            key={dept._id}
            department={dept}
            onApply={onApplyDepartment}
            onViewDetails={(d) => setSelectedDeptDetail(d)}
            userApplied={appliedDeptIds.has(dept._id)}
          />
        ))}
      </div>

      {/* Department Details Modal */}
      {selectedDeptDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            
            {/* Modal Image Header */}
            <div className="relative h-56 w-full bg-slate-950">
              <img
                src={selectedDeptDetail.coverImage}
                alt={selectedDeptDetail.name}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <button
                onClick={() => setSelectedDeptDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 backdrop-blur"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold">
                  {selectedDeptDetail.code}
                </span>
                <h2 className="text-2xl font-black text-white mt-1">{selectedDeptDetail.name}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overview</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedDeptDetail.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Total Seats</span>
                  <span className="font-bold text-white text-sm">{selectedDeptDetail.totalSeats} Seats</span>
                </div>

                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Available</span>
                  <span className="font-bold text-emerald-400 text-sm">{selectedDeptDetail.availableSeats} Left</span>
                </div>

                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Tuition Fee</span>
                  <span className="font-bold text-white text-sm">${selectedDeptDetail.feePerSemester}/sem</span>
                </div>

                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Eligibility</span>
                  <span className="font-bold text-indigo-400 text-sm">{selectedDeptDetail.eligibilityPercentage}% Min</span>
                </div>
              </div>

              {/* Requirements List */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admission Criteria & Documents</h4>
                <ul className="space-y-2">
                  {selectedDeptDetail.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedDeptDetail(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    onApplyDepartment(selectedDeptDetail);
                    setSelectedDeptDetail(null);
                  }}
                  disabled={appliedDeptIds.has(selectedDeptDetail._id)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg ${
                    appliedDeptIds.has(selectedDeptDetail._id)
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                  }`}
                >
                  {appliedDeptIds.has(selectedDeptDetail._id) ? 'Application Submitted' : 'Submit Application'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
