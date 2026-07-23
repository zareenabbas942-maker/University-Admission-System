import React, { useState } from 'react';
import { MeritList, Department } from '../types';
import { Award, Search, Printer, CheckCircle2, AlertCircle, Sparkles, Building2 } from 'lucide-react';

interface MeritListsPageProps {
  meritLists: MeritList[];
  departments: Department[];
}

export const MeritListsPage: React.FC<MeritListsPageProps> = ({ meritLists, departments }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const publishedLists = meritLists.filter((m) => m.isPublished);

  const filteredLists = publishedLists.filter((m) => {
    return selectedDeptId === 'all' || m.departmentId === selectedDeptId;
  });

  const handlePrintList = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" /> Official Admission Results
          </div>
          <h1 className="text-3xl font-black text-white">Published Merit Lists 2026</h1>
          <p className="text-slate-400 text-sm mt-1">
            Search your CNIC or name to verify your selection status for Fall 2026.
          </p>
        </div>

        <button
          onClick={handlePrintList}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 self-start md:self-auto shadow-md"
        >
          <Printer className="w-4 h-4 text-indigo-400" /> Print Merit List PDF
        </button>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Student Name or CNIC..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Department Select */}
        <select
          value={selectedDeptId}
          onChange={(e) => setSelectedDeptId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name} ({dept.code})
            </option>
          ))}
        </select>
      </div>

      {/* Merit Lists Display */}
      {filteredLists.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Published Merit Lists Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Merit lists for this department are currently being compiled by the Registrar Office and will be published shortly.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredLists.map((m) => {
            const matchingStudents = m.selectedStudents.filter((s) => {
              if (!searchQuery) return true;
              return (
                s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.cnic.includes(searchQuery)
              );
            });

            return (
              <div
                key={m._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
              >
                {/* List Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase">
                      {m.listNumber}{m.listNumber === 1 ? 'st' : m.listNumber === 2 ? 'nd' : 'rd'} Official Merit List
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">{m.departmentName}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Formula: {m.formulaWeightage.matric}% Matric + {m.formulaWeightage.inter}% FSc • Published: {new Date(m.generatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Cutoff Aggregate</span>
                    <span className="text-xl font-black text-emerald-400">{m.cutoffAggregate}%</span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">CNIC / B-Form</th>
                        <th className="py-3 px-4">Aggregate Score</th>
                        <th className="py-3 px-4">Selection Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {matchingStudents.map((st) => (
                        <tr
                          key={st.studentId}
                          className={
                            searchQuery &&
                            (st.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              st.cnic.includes(searchQuery))
                              ? 'bg-indigo-600/20 font-bold'
                              : 'hover:bg-slate-850/50'
                          }
                        >
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-white font-mono font-bold">
                              #{st.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">{st.studentName}</td>
                          <td className="py-3 px-4 font-mono text-slate-400">{st.cnic}</td>
                          <td className="py-3 px-4 font-black text-emerald-400 text-sm">
                            {st.aggregate}%
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                st.status === 'selected'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {st.status === 'selected' ? 'Selected for Admission' : 'Waiting List'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
