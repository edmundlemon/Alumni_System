import React, { useState } from 'react';

const events = [
  {
    title: "Alumni Talk",
    date: "2025-05-14",
    description: "Career sharing by alumni from top tech companies",
    location: "Online - Zoom",
    type: "workshop",
    time: "2:00 PM - 4:00 PM",
    organizer: "Alumni Relations Office"
  },
  {
    title: "Tech Fair",
    date: "2025-05-20",
    description: "Annual technology project exhibition featuring student innovations",
    location: "Main Hall, Campus Center",
    type: "exhibition",
    time: "10:00 AM - 6:00 PM",
    organizer: "Engineering Faculty"
  },
  {
    title: "Networking Night",
    date: "2025-06-10",
    description: "Opportunity to meet and connect with industry professionals",
    location: "Grand Auditorium",
    type: "social",
    time: "7:00 PM - 9:30 PM",
    organizer: "Career Services"
  }
];

function CalendarCell({ date, events, isCurrentMonth, isToday, onEventClick }) {
  const isoDate = date.toISOString().split("T")[0];
  const eventForDay = events.filter(event => event.date === isoDate);

  return (
    <div className={`p-2 border h-28 overflow-y-auto ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${
      isToday ? 'border-2 border-blue-500' : ''
    }`}>
      <div className={`text-sm font-bold ${
        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
      } ${isToday ? 'text-blue-600' : ''}`}>
        {date.getDate()}
      </div>
      {eventForDay.map((event, i) => (
        <div 
          key={i} 
          className={`text-xs p-1 mt-1 rounded border cursor-pointer hover:opacity-80 ${
            event.type === 'workshop' ? 'bg-blue-100 text-blue-800 border-blue-200' :
            event.type === 'exhibition' ? 'bg-purple-100 text-purple-800 border-purple-200' :
            'bg-green-100 text-green-800 border-green-200'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onEventClick(event);
          }}
        >
          {event.title}
        </div>
      ))}
    </div>
  );
}

function Calendar({ year, month, events, onEventClick }) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const daysInMonth = endDate.getDate();
  const firstDayOfWeek = startDate.getDay();
  const today = new Date();

  const days = [];

  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  // Add cells for each day of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push(date);
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="font-bold text-center p-2 bg-gray-100 rounded-t">
          {day}
        </div>
      ))}
      {days.map((date, index) => {
        if (!date) {
          return <div key={`empty-${index}`} className="h-28 bg-gray-50" />;
        }
        
        const isToday = date.toDateString() === today.toDateString();
        const isCurrentMonth = date.getMonth() === month;
        
        return (
          <div 
            key={date.toISOString()} 
            className={`border min-h-[70px] ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}
          >
            <CalendarCell 
              date={date} 
              events={events} 
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              onEventClick={onEventClick}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function CalendarWithEvents() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleEventClick = (event, clientX, clientY) => {
    setSelectedEvent(event);
    setModalPosition({
      x: clientX - 20, // Offset to prevent covering the clicked element
      y: clientY - 20
    });
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 relative">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handlePrev} 
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          &larr; Prev
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <select 
            value={year} 
            onChange={handleYearChange} 
            className="border rounded-lg px-3 py-1 bg-white shadow-sm"
          >
            {[...Array(10)].map((_, i) => {
              const y = today.getFullYear() - 3 + i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>
        <button 
          onClick={handleNext} 
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Next &rarr;
        </button>
      </div>

      {/* Calendar Grid */}
      <div 
        onClick={closeModal}
        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
      >
        <Calendar 
          year={year} 
          month={month} 
          events={events} 
          onEventClick={(event) => handleEventClick(event, event.clientX, event.clientY)}
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div 
          className="absolute z-50 w-72 bg-white border border-gray-300 rounded-lg shadow-xl p-4"
          style={{
            top: `${modalPosition.y}px`,
            left: `${modalPosition.x}px`,
            transform: modalPosition.x > window.innerWidth / 2 ? 'translateX(-100%)' : 'none'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800">{selectedEvent.title}</h3>
            <button 
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-center">
              <span className="w-24 font-medium">Date:</span>
              {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            <p className="flex items-center">
              <span className="w-24 font-medium">Time:</span>
              {selectedEvent.time}
            </p>
            <p className="flex items-start">
              <span className="w-24 font-medium">Location:</span>
              {selectedEvent.location}
            </p>
            <p className="flex items-start">
              <span className="w-24 font-medium">Description:</span>
              {selectedEvent.description}
            </p>
            <p className="flex items-center">
              <span className="w-24 font-medium">Organizer:</span>
              {selectedEvent.organizer}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}