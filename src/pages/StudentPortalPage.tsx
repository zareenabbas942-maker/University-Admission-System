import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Application, Department } from '../types';
import { User, BookOpen, Award, FileText, CheckCircle2, Clock, AlertCircle, RefreshCw, Printer, CreditCard, ShieldCheck } from 'lucide-react';

interface StudentPortalPageProps {
  myApplications: Application[];
  departments: Department[];
  onOpenFeeChallan: (app: Application) => void;
  onRefreshApplications: () => void;
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({
  myApplications,
  departments,
  onOpenFeeChallan,
  onRefreshApplications
}) => {
  const { user, updateProfile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'profile'>('applications');

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [cnic, setCnic] = useState(user?.cnic || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  // Academic States
  const [matricMarks, setMatricMarks] = useState(user?.academicDetails?.matricMarks || 1020);
  const [matricTotal, setMatricTotal] = useState(user?.academicDetails?.matricTotal || 1100);
  const [interMarks, setInterMarks] = useState(user?.academicDetails?.interMarks || 1010);
  const [interTotal, setInterTotal] = useState(user?.academicDetails?.interTotal || 1100);
  const [testMarks, setTestMarks] = useState(user?.academicDetails?.testMarks || 88);
  const [testTotal, setTestTotal] = useState(user?.academicDetails?.testTotal || 100);
  const [degreeTitle, setDegreeTitle] = useState(user?.academicDetails?.degreeTitle || 'FSc Pre-Engineering');
  const [boardName, setBoardName] = useState(user?.academicDetails?.boardName || 'FBISE Islamabad');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const res = await updateProfile({
      name,
      cnic,
      phone,
      profileImage,
      academicDetails: {
        matricMarks: Number(matricMarks),
        matricTotal: Number(matricTotal),
        interMarks: Number(interMarks),
        interTotal: Number(interTotal),
        testMarks: Number(testMarks),
        testTotal: Number(testTotal),
        degreeTitle,
        boardName
      }
    });

    setSaving(false);
    if (res.success) {
      setMsg({ type: 'success', text: 'Personal & Academic profile updated successfully.' });
    } else {
      setMsg({ type: 'error', text: res.message || 'Failed to update profile.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Student Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5 w-full sm:w-auto">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300'}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] uppercase">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email} • CNIC: {user?.cnic || 'Not Provided'}</p>
            <p className="text-xs text-indigo-400 font-semibold mt-1">
              Degree: {user?.academicDetails?.degreeTitle || 'FSc Pre-Engineering'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs inside Portal */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'applications'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> My Applications ({myApplications.length})
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Profile & Academic Marks
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: My Applications */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Application Tracking & Status</h2>
            <button
              onClick={onRefreshApplications}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {myApplications.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No Applications Submitted Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Explore available university departments and submit your application for Fall 2026.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map((app) => {
                const dept = departments.find((d) => d._id === app.departmentId);
                return (
                  <div
                    key={app._id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all space-y-6"
                  >
                    {/* Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold">
                          {app.departmentCode}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">{app.departmentName}</h3>
                        <p className="text-xs text-slate-400">
                          Submitted on: {new Date(app.submittedAt).toLocaleDateString()} • App Ref: {app._id.substring(0, 8)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase">Calculated Aggregate</span>
                          <span className="text-xl font-black text-emerald-400">{app.calculatedAggregate}%</span>
                        </div>

                        {app.status === 'approved' && (
                          <button
                            onClick={() => onOpenFeeChallan(app)}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                          >
                            <Printer className="w-4 h-4" /> Download Fee Challan
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Status Stepper */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                        Admission Progress Timeline
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        
                        {/* Step 1: Application Submitted */}
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white">1. Form Submitted</p>
                            <p className="text-[10px] text-slate-400">Received by Registrar</p>
                          </div>
                        </div>

                        {/* Step 2: Verification / Shortlist */}
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                          app.status === 'approved' || app.status === 'shortlisted'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : app.status === 'rejected'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        }`}>
                          {app.status === 'approved' || app.status === 'shortlisted' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-white">2. Merit Verification</p>
                            <p className="text-[10px] capitalize">{app.status}</p>
                          </div>
                        </div>

                        {/* Step 3: Fee Payment / Final Admission */}
                        <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                          app.feeStatus === 'paid'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-800 border-slate-700/80 text-slate-400'
                        }`}>
                          <CreditCard className="w-5 h-5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white">3. Bank Fee Payment</p>
                            <p className="text-[10px] uppercase font-bold">{app.feeStatus}</p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Registrar Notes */}
                    {app.reviewNotes && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-indigo-300">Registrar Remark:</span> {app.reviewNotes}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: Profile & Academic Form */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white">Edit Student Personal & Academic Details</h2>
            <p className="text-xs text-slate-400">Ensure academic marks match your official board certificate transcripts.</p>
          </div>

          {msg && (
            <div className={`p-4 rounded-xl text-xs font-bold border ${
              msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {msg.text}
            </div>
          )}

          {/* Personal Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CNIC / B-Form Number</label>
                <input
                  type="text"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="35201-1234567-1"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>
          </div>

          {/* Academic Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Academic Record & Marks</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Degree Title</label>
                <input
                  type="text"
                  value={degreeTitle}
                  onChange={(e) => setDegreeTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="FSc Pre-Engineering / ICS"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Board / University Name</label>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="FBISE Islamabad / BISE Lahore"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Matriculation (SSC) Marks</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">Obtained</span>
                    <input
                      type="number"
                      value={matricMarks}
                      onChange={(e) => setMatricMarks(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Total</span>
                    <input
                      type="number"
                      value={matricTotal}
                      onChange={(e) => setMatricTotal(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Intermediate (HSSC) Marks</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">Obtained</span>
                    <input
                      type="number"
                      value={interMarks}
                      onChange={(e) => setInterMarks(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Total</span>
                    <input
                      type="number"
                      value={interTotal}
                      onChange={(e) => setInterTotal(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Entry Test Score (Optional)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">Obtained</span>
                    <input
                      type="number"
                      value={testMarks}
                      onChange={(e) => setTestMarks(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Total</span>
                    <input
                      type="number"
                      value={testTotal}
                      onChange={(e) => setTestTotal(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            >
              {saving ? 'Saving...' : 'Save Updated Profile'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
