
import React, { useState, useMemo } from 'react';
import { Appointment } from '../types';

interface TimeSlotRowProps {
  slot: string;
  appointments: Appointment[];
  selectedDateStr: string;
  onAddClick: () => void;
  onDelete: (id: string) => void;
  onUpdateAppointment: (id: string, updates: Partial<Appointment>) => void;
}

const TimeSlotRow: React.FC<TimeSlotRowProps> = ({ 
  slot, 
  appointments, 
  selectedDateStr,
  onAddClick, 
  onDelete, 
  onUpdateAppointment 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingOutcomeId, setEditingOutcomeId] = useState<string | null>(null);
  const [outcomeDraft, setOutcomeDraft] = useState('');

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Determine if this time slot has already passed
  const isPastSlot = useMemo(() => {
    try {
      const endTimeStr = slot.split(' - ')[1]; 
      const [time, modifier] = endTimeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const slotEndTime = new Date(selectedDateStr);
      slotEndTime.setHours(hours, minutes, 0, 0);
      
      return new Date() > slotEndTime;
    } catch (e) {
      return false;
    }
  }, [slot, selectedDateStr]);

  const startEditing = (app: Appointment) => {
    setEditingOutcomeId(app.id);
    setOutcomeDraft(app.outcome || '');
  };

  const saveOutcome = (id: string) => {
    onUpdateAppointment(id, { outcome: outcomeDraft, status: 'completed' });
    setEditingOutcomeId(null);
  };

  const handleYes = (id: string) => {
    const app = appointments.find(a => a.id === id);
    setEditingOutcomeId(id);
    setOutcomeDraft(app?.outcome || '');
  };

  const setStatusMissed = (id: string) => {
    onUpdateAppointment(id, { status: 'missed', outcome: undefined });
  };

  return (
    <div className="group border-b border-slate-100 last:border-0 overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-400 min-w-[120px] uppercase tracking-tighter">{slot}</span>
          <div className="flex -space-x-2">
            {appointments.map((app) => (
              <div 
                key={app.id} 
                className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm transition-transform hover:scale-110 z-10
                  ${app.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                    app.status === 'missed' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-700'}
                `}
                title={`${app.name}${app.status === 'completed' ? ' (Completed)' : ''}`}
              >
                {app.name.charAt(0)}
              </div>
            ))}
            {appointments.length === 0 && (
              <span className="text-xs text-slate-300 italic">Available</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={onAddClick}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Add appointment"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          </button>
          <button 
            onClick={toggleExpand}
            className={`p-2 rounded-lg transition-all duration-200 ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <svg 
              className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-slate-50/50 p-4 pt-0 animate-in slide-in-from-top-2 duration-300">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(app => (
                <div key={app.id} className={`bg-white p-5 rounded-2xl border shadow-sm flex flex-col gap-4 group/card transition-colors ${app.status === 'missed' ? 'border-slate-100 opacity-60' : 'border-slate-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          app.status === 'completed' ? 'bg-emerald-500' : 
                          app.status === 'missed' ? 'bg-slate-300' : 'bg-indigo-500'
                        }`}></div>
                        {app.name}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{app.description || 'No description provided.'}</p>
                    </div>
                    <button 
                      onClick={() => onDelete(app.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover/card:opacity-100 transition-all rounded-md hover:bg-rose-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>

                  {isPastSlot && app.status !== 'missed' && (
                    <div className="border-t border-slate-100 pt-3">
                      {/* Only show Question if we are not currently editing this app and it has no status */}
                      {!app.status && !app.outcome && editingOutcomeId !== app.id ? (
                        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Did the meeting happen?</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleYes(app.id)}
                              className="text-xs font-bold px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                              Yes
                            </button>
                            <button 
                              onClick={() => setStatusMissed(app.id)}
                              className="text-xs font-bold px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                              No
                            </button>
                          </div>
                        </div>
                      ) : (app.status === 'completed' || editingOutcomeId === app.id) ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Meeting Outcome (Optional)</span>
                            {editingOutcomeId !== app.id && (
                              <button 
                                onClick={() => startEditing(app)}
                                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase"
                              >
                                Edit Outcome
                              </button>
                            )}
                          </div>
                          
                          {editingOutcomeId === app.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={outcomeDraft}
                                onChange={(e) => setOutcomeDraft(e.target.value)}
                                className="w-full text-sm p-3 rounded-xl border border-indigo-100 bg-indigo-50/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                                placeholder="What was the result of the meeting? (Optional)"
                                autoFocus
                              />
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={() => {
                                    setEditingOutcomeId(null);
                                    // If it was just clicked Yes but cancelled, don't set status yet unless desired
                                  }}
                                  className="text-xs font-semibold px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => saveOutcome(app.id)}
                                  className="text-xs font-semibold px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                                >
                                  {outcomeDraft.trim() ? 'Save Outcome' : 'Mark Completed'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className={`text-sm ${app.outcome ? 'text-slate-700 italic font-medium' : 'text-slate-300 italic'}`}>
                              {app.outcome || 'Meeting completed with no additional notes.'}
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Created {new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {app.status === 'completed' && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-tight">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                        Completed
                      </span>
                    )}
                    {app.status === 'missed' && (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Not Conducted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm">
              No appointments for this time slot.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSlotRow;
