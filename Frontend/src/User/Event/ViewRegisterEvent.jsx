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
import axios from "axios";
import Cookies from "js-cookie";

export default function ViewEvent() {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const eventModal = createEventModalPlugin();
  const [events, setEvents] = useState([]);
  const token = Cookies.get("token");
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
    const fetchEvents = async() =>{
      try {
        const response = await axios.get("http://localhost:8000/api/view_my_registrations", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    if(token) {
      fetchEvents();
    } else {
      console.error("No token found, user might not be authenticated");
    }
  }, [eventsService]);

  return (
    <div className="bg-[#f7f9f9] pt-6 ">
      <div className="mx-40">
        <h2 className="text-3xl  font-semibold mb-4 uppercase">Register Event</h2>
      <div className="h-[700px] overflow-hidden">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
      </div>
    </div>
  );
}