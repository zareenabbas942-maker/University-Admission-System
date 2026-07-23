import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AggregateCalculatorModal } from './components/AggregateCalculatorModal';
import { FeeChallanModal } from './components/FeeChallanModal';

import { HomePage } from './pages/HomePage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { MeritListsPage } from './pages/MeritListsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';

import { Department, Application, MeritList, Announcement } from './types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

function AppContent() {
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');

  // Shared Data States
  const [departments, setDepartments] = useState<Department[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [meritLists, setMeritLists] = useState<MeritList[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Modals States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'student' | 'admin'>('student');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [calcModalOpen, setCalcModalOpen] = useState(false);

  const [challanModalOpen, setChallanModalOpen] = useState(false);
  const [activeChallanApp, setActiveChallanApp] = useState<Application | null>(null);

  // Toast notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    fetchDepartments();
    fetchPublicMeritLists();
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (token) {
      fetchMyApplications();
      if (user?.role === 'admin') {
        fetchAllApplicationsAdmin();
        fetchAllMeritListsAdmin();
      }
    } else {
      setMyApplications([]);
      setAllApplications([]);
    }
  }, [token, user]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      if (res.ok) {
        const data = await res.json();
        setDepartments(data.departments);
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  const fetchPublicMeritLists = async () => {
    try {
      const res = await fetch('/api/merit-list/public');
      if (res.ok) {
        const data = await res.json();
        setMeritLists(data.meritLists);
      }
    } catch (err) {
      console.error('Failed to load public merit lists:', err);
    }
  };

  const fetchAllMeritListsAdmin = async () => {
    try {
      const res = await fetch('/api/merit-list/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMeritLists(data.meritLists);
      }
    } catch (err) {
      console.error('Failed to load all merit lists:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    }
  };

  const fetchMyApplications = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyApplications(data.applications);
      }
    } catch (err) {
      console.error('Failed to load my applications:', err);
    }
  };

  const fetchAllApplicationsAdmin = async () => {
    if (!token || user?.role !== 'admin') return;
    try {
      const res = await fetch('/api/applications/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAllApplications(data.applications);
      }
    } catch (err) {
      console.error('Failed to load admin applications:', err);
    }
  };

  // Student Apply Action
  const handleApplyDepartment = async (dept: Department) => {
    if (!user) {
      setAuthRole('student');
      setAuthMode('login');
      setAuthModalOpen(true);
      showToast('error', 'Please log in to submit your admission application.');
      return;
    }

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          departmentId: dept._id
        })
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('error', data.message || 'Application submission failed.');
        return;
      }

      showToast('success', `Application for ${dept.name} submitted successfully!`);
      fetchMyApplications();
      setActiveTab('student-portal');
    } catch (err: any) {
      showToast('error', err.message || 'Submission failed.');
    }
  };

  // Open Fee Challan Modal
  const handleOpenFeeChallan = (app: Application) => {
    setActiveChallanApp(app);
    setChallanModalOpen(true);
  };

  // Mark Fee as Paid
  const handleMarkFeeAsPaid = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/pay-fee`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Fee payment confirmed! Admission locked.');
        fetchMyApplications();
        if (activeChallanApp) {
          setActiveChallanApp({ ...activeChallanApp, feeStatus: 'paid', status: 'approved' });
        }
      } else {
        showToast('error', data.message);
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-md animate-fade-in max-w-md ${
          toast.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-semibold leading-snug">{toast.message}</span>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-80 ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={(role = 'student', mode = 'login') => {
          setAuthRole(role);
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        openCalculator={() => setCalcModalOpen(true)}
      />

      {/* Main Page Router View */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <HomePage
            departments={departments}
            myApplications={myApplications}
            announcements={announcements}
            onApplyDepartment={handleApplyDepartment}
            onViewDepartmentDetails={() => setActiveTab('departments')}
            onNavigate={setActiveTab}
            openCalculator={() => setCalcModalOpen(true)}
          />
        )}

        {activeTab === 'departments' && (
          <DepartmentsPage
            departments={departments}
            myApplications={myApplications}
            onApplyDepartment={handleApplyDepartment}
            onAddDepartmentAdmin={() => setActiveTab('admin-portal')}
          />
        )}

        {activeTab === 'student-portal' && (
          <StudentPortalPage
            myApplications={myApplications}
            departments={departments}
            onOpenFeeChallan={handleOpenFeeChallan}
            onRefreshApplications={fetchMyApplications}
          />
        )}

        {activeTab === 'admin-portal' && (
          <AdminPortalPage
            departments={departments}
            allApplications={allApplications}
            meritLists={meritLists}
            announcements={announcements}
            onRefreshData={() => {
              fetchDepartments();
              fetchAllApplicationsAdmin();
              fetchAllMeritListsAdmin();
              fetchAnnouncements();
            }}
          />
        )}

        {activeTab === 'merit-lists' && (
          <MeritListsPage
            meritLists={meritLists}
            departments={departments}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsPage
            announcements={announcements}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        openCalculator={() => setCalcModalOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authRole}
        defaultMode={authMode}
      />

      <AggregateCalculatorModal
        isOpen={calcModalOpen}
        onClose={() => setCalcModalOpen(false)}
        departments={departments}
        onApplyDepartment={(deptId) => {
          const dept = departments.find((d) => d._id === deptId);
          if (dept) handleApplyDepartment(dept);
        }}
      />

      <FeeChallanModal
        isOpen={challanModalOpen}
        onClose={() => setChallanModalOpen(false)}
        application={activeChallanApp}
        department={departments.find((d) => d._id === activeChallanApp?.departmentId) || null}
        onMarkAsPaid={handleMarkFeeAsPaid}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
