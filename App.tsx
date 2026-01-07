
import React, { useState, useMemo } from 'react';
import Calendar from './components/Calendar';
import TimeSlotRow from './components/TimeSlotRow';
import AppointmentModal from './components/AppointmentModal';
import Reports from './components/Reports';
import { Appointment, User } from './types';
import { TIME_SLOTS, MOCK_APPOINTMENTS, ADMIN_CREDENTIALS } from './constants';

type NavigationTab = 'calendar' | 'reports';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('calendar');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => app.date === selectedDateStr);
  }, [appointments, selectedDateStr]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === ADMIN_CREDENTIALS.username && loginPassword === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUser({ id: '1', username: 'admin', role: 'admin' });
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('calendar');
  };

  const handleAddAppointment = (name: string, description: string, date: string, timeSlot: string) => {
    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      date: date,
      timeSlot: timeSlot,
      name,
      description,
      status: 'pending',
      createdAt: Date.now()
    };
    setAppointments([...appointments, newApp]);
    setIsModalOpen(false);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(app => app.id !== id));
  };

  const handleUpdateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ));
  };

  const openAddModal = (slot: string) => {
    setActiveSlot(slot);
    setIsModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-300 border border-slate-100 p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div>
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
               </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">CivicConnect</h1>
            <p className="text-slate-500 mt-2 font-medium">Administrator Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <div className="bg-rose-50 text-rose-600 text-sm px-4 py-2.5 rounded-xl border border-rose-100 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Access Portal
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">admin / password123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
             </svg>
          </div>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">CivicConnect</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm
              ${activeTab === 'calendar' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Calendar
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm
              ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 00-4-4H5m11 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h11a2 2 0 012 2zM7 7a2 2 0 114 0 2 2 0 01-4 0z"/></svg>
            Reports
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm text-white font-bold border-2 border-white shadow-sm">A</div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.username}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Administrator</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Logout Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'calendar' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Calendar & Scheduling</h1>
                  <p className="text-slate-500 font-medium">Managing constituent outreach for <span className="text-indigo-600 font-bold">{selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
                </div>
                <button 
                  onClick={() => openAddModal(TIME_SLOTS[9].label)} // Defaults to 09:00 AM when clicking top right
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  New Meeting
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Interactive Calendar */}
                <div className="lg:col-span-4 space-y-6">
                  <Calendar 
                    selectedDate={selectedDate} 
                    onDateChange={setSelectedDate} 
                    appointments={appointments}
                  />
                  
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Summary</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm font-medium">Daily Load</span>
                      <span className="text-slate-900 font-bold">{filteredAppointments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-sm font-medium">Completed</span>
                      <span className="text-emerald-600 font-bold">{filteredAppointments.filter(a => a.status === 'completed').length}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-700">Timeline for {selectedDate.toLocaleDateString(undefined, { weekday: 'long' })}</h3>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                    {TIME_SLOTS.map(slot => (
                      <TimeSlotRow 
                        key={slot.label} 
                        slot={slot.label} 
                        selectedDateStr={selectedDateStr}
                        appointments={filteredAppointments.filter(app => app.timeSlot === slot.label)}
                        onAddClick={() => openAddModal(slot.label)}
                        onDelete={handleDeleteAppointment}
                        onUpdateAppointment={handleUpdateAppointment}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <Reports appointments={appointments} />
            </div>
          )}
        </div>
      </main>

      {/* Appointment Modal */}
      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAppointment}
        initialTimeSlot={activeSlot || TIME_SLOTS[9].label}
        initialDate={selectedDateStr}
      />
    </div>
  );
};

export default App;
