import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Department, Application, MeritList, AnalyticsData, Announcement } from '../types';
import {
  Shield,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Award,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  Search,
  Calculator,
  Eye,
  EyeOff,
  BellRing,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';

interface AdminPortalPageProps {
  departments: Department[];
  allApplications: Application[];
  meritLists: MeritList[];
  announcements: Announcement[];
  onRefreshData: () => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  departments,
  allApplications,
  meritLists,
  announcements,
  onRefreshData
}) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'departments' | 'applications' | 'merit' | 'announcements'>('analytics');

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Department CRUD modal state
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    category: 'Computer Science',
    description: '',
    totalSeats: 60,
    feePerSemester: 1200,
    eligibilityPercentage: 60,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'
  });

  // Application Filter
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');
  const [appDeptFilter, setAppDeptFilter] = useState<string>('all');

  // Merit List Generator state
  const [meritDeptId, setMeritDeptId] = useState<string>('');
  const [meritListNumber, setMeritListNumber] = useState<number>(1);
  const [weightMatric, setWeightMatric] = useState<number>(30);
  const [weightInter, setWeightInter] = useState<number>(70);
  const [weightTest, setWeightTest] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState('Admission');
  const [annImportant, setAnnImportant] = useState(true);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchAnalytics();
    if (departments.length > 0 && !meritDeptId) {
      setMeritDeptId(departments[0]._id);
    }
  }, [departments]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  // Department CRUD Operations
  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    try {
      const url = editingDept ? `/api/departments/${editingDept._id}` : '/api/departments';
      const method = editingDept ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(deptForm)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      setFeedback({ type: 'success', text: editingDept ? 'Department updated.' : 'Department added successfully.' });
      setDeptModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await fetch(`/api/departments/${deptId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedback({ type: 'success', text: 'Department deleted.' });
        onRefreshData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  // Update Application Status
  const handleUpdateAppStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, reviewNotes: `Updated by Admin to ${status.toUpperCase()}` })
      });
      if (res.ok) {
        setFeedback({ type: 'success', text: `Application status updated to ${status}.` });
        onRefreshData();
        fetchAnalytics();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  // Generate Merit List
  const handleGenerateMeritList = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/merit-list/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          departmentId: meritDeptId,
          listNumber: Number(meritListNumber),
          formula: {
            matric: Number(weightMatric),
            inter: Number(weightInter),
            test: Number(weightTest)
          },
          publishImmediately: true
        })
      });

      const data = await res.json();
      setIsGenerating(false);

      if (!res.ok) throw new Error(data.message || 'Merit list generation failed');

      setFeedback({ type: 'success', text: data.message });
      onRefreshData();
    } catch (err: any) {
      setIsGenerating(false);
      setFeedback({ type: 'error', text: err.message });
    }
  };

  // Toggle Publish Merit List
  const handleTogglePublishMerit = async (meritId: string) => {
    try {
      const res = await fetch(`/api/merit-list/${meritId}/toggle-publish`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Create Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: annTitle,
          content: annContent,
          category: annCategory,
          isImportant: annImportant
        })
      });
      if (res.ok) {
        setAnnTitle('');
        setAnnContent('');
        setFeedback({ type: 'success', text: 'Announcement published.' });
        onRefreshData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  // Filter Applications
  const filteredApps = allApplications.filter((app) => {
    const matchesSearch = app.studentName.toLowerCase().includes(appSearch.toLowerCase()) ||
                          app.cnic.includes(appSearch) ||
                          app.departmentName.toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
    const matchesDept = appDeptFilter === 'all' || app.departmentId === appDeptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Control Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">University Registrar Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] uppercase">
                Admin Privilege
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage degree departments, calculate merit lists, and review student applications.
            </p>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'analytics', label: 'Analytics', icon: Users },
            { id: 'departments', label: 'Departments', icon: Building2 },
            { id: 'applications', label: 'Student Apps', icon: CheckCircle2 },
            { id: 'merit', label: 'Merit Studio', icon: Award },
            { id: 'announcements', label: 'Notices', icon: BellRing }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-bold border flex items-center justify-between ${
          feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Admissions Key Performance Indicators</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Applications</span>
              <p className="text-3xl font-black text-indigo-400">{analytics?.totalApplications ?? allApplications.length}</p>
              <p className="text-[11px] text-slate-500">Across all degree departments</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Pending Review</span>
              <p className="text-3xl font-black text-amber-400">{analytics?.pendingApprovals ?? allApplications.filter(a => a.status === 'pending').length}</p>
              <p className="text-[11px] text-slate-500">Queued for academic verification</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Accepted / Admitted</span>
              <p className="text-3xl font-black text-emerald-400">{analytics?.acceptedStudents ?? allApplications.filter(a => a.status === 'approved').length}</p>
              <p className="text-[11px] text-slate-500">Official admission granted</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Revenue / Fees</span>
              <p className="text-3xl font-black text-teal-400">${analytics?.totalRevenue ?? 12500}</p>
              <p className="text-[11px] text-slate-500">Paid Bank Fee Challans</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Department Management (CRUD) */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Department Catalog & Seat Management</h2>
              <p className="text-xs text-slate-400">Configure total seats, tuition fee structures, and eligibility cutoffs.</p>
            </div>

            <button
              onClick={() => {
                setEditingDept(null);
                setDeptForm({
                  name: '',
                  code: '',
                  category: 'Computer Science',
                  description: '',
                  totalSeats: 60,
                  feePerSemester: 1200,
                  eligibilityPercentage: 60,
                  coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'
                });
                setDeptModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-600/30"
            >
              <Plus className="w-4 h-4" /> Create Department
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                    {dept.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingDept(dept);
                        setDeptForm({
                          name: dept.name,
                          code: dept.code,
                          category: dept.category,
                          description: dept.description,
                          totalSeats: dept.totalSeats,
                          feePerSemester: dept.feePerSemester,
                          eligibilityPercentage: dept.eligibilityPercentage,
                          coverImage: dept.coverImage
                        });
                        setDeptModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(dept._id)}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base">{dept.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{dept.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Seats</span>
                    <span className="font-bold text-slate-200">{dept.availableSeats} / {dept.totalSeats}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Fee / Sem</span>
                    <span className="font-bold text-emerald-400">${dept.feePerSemester}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Student Application Review */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Student Application Desk</h2>
              <p className="text-xs text-slate-400">Verify transcripts, review calculated aggregates, and set statuses.</p>
            </div>

            <button
              onClick={onRefreshData}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh List
            </button>
          </div>

          {/* Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Search applicant name or CNIC..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={appStatusFilter}
              onChange={(e) => setAppStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={appDeptFilter}
              onChange={(e) => setAppDeptFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          {/* Applications Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Student Info</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Academic Marks</th>
                  <th className="py-3.5 px-4">Aggregate</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-850/50">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm">{app.studentName}</p>
                      <p className="text-[11px] text-slate-400">{app.studentEmail} • CNIC: {app.cnic}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-indigo-400">{app.departmentCode}</span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{app.departmentName}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p>Matric: {app.academicDetails.matricMarks}/1100</p>
                      <p>Inter: {app.academicDetails.interMarks}/1100</p>
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm text-emerald-400">
                      {app.calculatedAggregate}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : app.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleUpdateAppStatus(app._id, 'approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app._id, 'shortlisted')}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px]"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app._id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/30 text-rose-300 hover:bg-rose-600/50 font-bold text-[10px]"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Merit List Studio */}
      {activeTab === 'merit' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Merit List Generator Studio
              </h2>
              <p className="text-xs text-slate-400">
                Auto-calculate rankings and publish official 1st, 2nd, or 3rd Merit Lists based on seats.
              </p>
            </div>

            <form onSubmit={handleGenerateMeritList} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Department</label>
                  <select
                    value={meritDeptId}
                    onChange={(e) => setMeritDeptId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    required
                  >
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>{d.name} ({d.code}) - {d.totalSeats} Total Seats</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Merit List Number</label>
                  <select
                    value={meritListNumber}
                    onChange={(e) => setMeritListNumber(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value={1}>1st Merit List</option>
                    <option value={2}>2nd Merit List</option>
                    <option value={3}>3rd Merit List</option>
                  </select>
                </div>
              </div>

              {/* Weightage Sliders */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <label className="block text-xs font-bold text-slate-300 uppercase">Formula Weightage Percentages</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-slate-400">Matric Weight: {weightMatric}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weightMatric}
                      onChange={(e) => setWeightMatric(Number(e.target.value))}
                      className="w-full accent-indigo-500 mt-1"
                    />
                  </div>

                  <div>
                    <span className="text-xs text-slate-400">Inter Weight: {weightInter}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weightInter}
                      onChange={(e) => setWeightInter(Number(e.target.value))}
                      className="w-full accent-indigo-500 mt-1"
                    />
                  </div>

                  <div>
                    <span className="text-xs text-slate-400">Test Weight: {weightTest}%</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weightTest}
                      onChange={(e) => setWeightTest(Number(e.target.value))}
                      className="w-full accent-indigo-500 mt-1"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> {isGenerating ? 'Calculating Rankings...' : 'Auto-Generate & Publish Merit List'}
              </button>
            </form>
          </div>

          {/* Generated Merit Lists Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Generated Merit Lists</h3>
            {meritLists.map((m) => (
              <div key={m._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase">
                      {m.listNumber}{m.listNumber === 1 ? 'st' : m.listNumber === 2 ? 'nd' : 'rd'} Merit List
                    </span>
                    <h4 className="font-bold text-white text-base">{m.departmentName}</h4>
                    <p className="text-xs text-slate-400">Cutoff Aggregate: {m.cutoffAggregate}% • Total Applicants Ranked: {m.selectedStudents.length}</p>
                  </div>

                  <button
                    onClick={() => handleTogglePublishMerit(m._id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                      m.isPublished
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {m.isPublished ? <><Eye className="w-4 h-4" /> Published</> : <><EyeOff className="w-4 h-4" /> Draft</>}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2">Rank</th>
                        <th className="py-2">Student Name</th>
                        <th className="py-2">CNIC</th>
                        <th className="py-2">Aggregate</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {m.selectedStudents.slice(0, 5).map((st) => (
                        <tr key={st.studentId}>
                          <td className="py-2 font-bold text-white">#{st.rank}</td>
                          <td className="py-2 font-medium">{st.studentName}</td>
                          <td className="py-2 text-slate-400">{st.cnic}</td>
                          <td className="py-2 font-bold text-emerald-400">{st.aggregate}%</td>
                          <td className="py-2 uppercase font-bold text-[10px] text-indigo-400">{st.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Announcements Manager */}
      {activeTab === 'announcements' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h2 className="text-xl font-bold text-white">Publish Campus Announcement</h2>
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Title</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                placeholder="e.g. 2nd Merit List Release Date Updated"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Content Details</label>
              <textarea
                required
                rows={3}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                placeholder="Details regarding deadline extensions..."
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/30"
            >
              Post Notice
            </button>
          </form>
        </div>
      )}

      {/* Department CRUD Modal */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-lg">{editingDept ? 'Edit Department' : 'Add New Department'}</h3>
              <button onClick={() => setDeptModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDepartment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Code (e.g. BSCS)</label>
                  <input
                    type="text"
                    required
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={deptForm.category}
                    onChange={(e) => setDeptForm({ ...deptForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Seats</label>
                  <input
                    type="number"
                    required
                    value={deptForm.totalSeats}
                    onChange={(e) => setDeptForm({ ...deptForm, totalSeats: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fee/Semester ($)</label>
                  <input
                    type="number"
                    required
                    value={deptForm.feePerSemester}
                    onChange={(e) => setDeptForm({ ...deptForm, feePerSemester: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Min Elig. %</label>
                  <input
                    type="number"
                    required
                    value={deptForm.eligibilityPercentage}
                    onChange={(e) => setDeptForm({ ...deptForm, eligibilityPercentage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeptModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
