
import React, { useState, useMemo } from 'react';
import { Appointment } from '../types';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  appointments: Appointment[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, appointments }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  // Create a map of dates that have appointments for performance
  const appointmentDates = useMemo(() => {
    const map = new Set<string>();
    appointments.forEach(app => map.add(app.date));
    return map;
  }, [appointments]);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDay = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-full"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const dateStr = dateObj.toISOString().split('T')[0];
      const isSelected = dateObj.toDateString() === selectedDate.toDateString();
      const isToday = dateObj.toDateString() === new Date().toDateString();
      const hasAppointments = appointmentDates.has(dateStr);

      days.push(
        <button
          key={d}
          onClick={() => onDateChange(dateObj)}
          className={`h-12 w-full flex flex-col items-center justify-center rounded-lg transition-all duration-200 text-sm font-medium relative group
            ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-slate-700'}
            ${isToday && !isSelected ? 'border border-indigo-200' : ''}
          `}
        >
          <span>{d}</span>
          {hasAppointments && (
            <div className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}></div>
          )}
        </button>
      );
    }
    return days;
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">{monthName}</h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
