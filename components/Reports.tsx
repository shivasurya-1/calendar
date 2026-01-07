
import React, { useState, useMemo, useEffect } from 'react';
import { Appointment } from '../types';

interface ReportsProps {
  appointments: Appointment[];
}

const Reports: React.FC<ReportsProps> = ({ appointments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDates, setOpenDates] = useState<string[]>([]);

  const toggleDate = (date: string) => {
    setOpenDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  /**
   * Helper to highlight text matching the search term
   */
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    // Escape special characters for regex
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const filteredAppointments = useMemo(() => {
    // Only show completed appointments in reports
    const completed = appointments.filter(app => app.status === 'completed');
    
    if (!searchTerm.trim()) return completed;
    
    const lowerSearch = searchTerm.toLowerCase();
    return completed.filter(app => 
      app.name.toLowerCase().includes(lowerSearch) ||
      app.description.toLowerCase().includes(lowerSearch) ||
      (app.outcome || '').toLowerCase().includes(lowerSearch) ||
      app.date.includes(lowerSearch)
    );
  }, [appointments, searchTerm]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    filteredAppointments.forEach(app => {
      if (!groups[app.date]) groups[app.date] = [];
      groups[app.date].push(app);
    });
    // Sort dates descending
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredAppointments]);

  // Automatically expand sections when searching
  useEffect(() => {
    if (searchTerm.trim() && groupedByDate.length > 0) {
      setOpenDates(groupedByDate.map(([date]) => date));
    }
  }, [searchTerm, groupedByDate]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Completed Meeting Reports</h2>
          {searchTerm && (
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Found {filteredAppointments.length} results
            </span>
          )}
        </div>
        <div className="relative">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search by constituent, purpose, outcome, or date..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {groupedByDate.length > 0 ? (
          groupedByDate.map(([date, apps]) => (
            <div key={date} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleDate(date)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span className="font-bold text-slate-700">
                    {highlightText(new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), searchTerm)}
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {apps.length} {apps.length === 1 ? 'Meeting' : 'Meetings'}
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openDates.includes(date) ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              
              {openDates.includes(date) && (
                <div className="p-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  {apps.map(app => (
                    <div key={app.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{highlightText(app.timeSlot, searchTerm)}</p>
                          <h4 className="text-lg font-bold text-slate-800">{highlightText(app.name, searchTerm)}</h4>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-[10px] font-bold uppercase">Completed</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Purpose</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{highlightText(app.description, searchTerm)}</p>
                        </div>
                        {app.outcome && (
                          <div className="pt-3 border-t border-slate-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Meeting Outcome</p>
                            <p className="text-sm text-slate-800 font-medium italic">
                              "{highlightText(app.outcome, searchTerm)}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h4l2 2h4l2-2h4a2 2 0 012 2v14a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 className="text-slate-800 font-bold">No completed meetings found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or complete more constituent meetings in the schedule view.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
