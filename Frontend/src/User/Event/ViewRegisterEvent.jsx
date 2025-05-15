import React, { useState, useEffect } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";

import { createEventModalPlugin } from "@schedule-x/event-modal";

export default function ViewEvent() {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const eventModal = createEventModalPlugin();

  const calendar = useCalendarApp({
    views: [
      createViewMonthGrid(),  // Month grid view first
      createViewDay(),
      createViewWeek(),
      createViewMonthAgenda(),
    ],
    defaultView: 'month-grid',  // Set month as default view
    events: [
      {
        id: "1",
        title: "Event 1",
        start: '2025-05-16 20:00',  // Fixed ISO format (added 'T')
        end: '2025-05-16 21:00',
        description: "Event 1 description",
      },
    ],
    plugins: [
      eventsService,
      eventModal
    ],
  });

  useEffect(() => {
    eventsService.getAll();
  }, [eventsService]);

  return (
    <div className="px-32 py-4">
      <h2 className="text-2xl mb-4">My Calendar</h2>
      <div className="[&_.sx__month-grid]:h-[700px]">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  );
}