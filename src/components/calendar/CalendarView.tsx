'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LunarDate } from 'vietnamese-lunar-calendar';

import EventModal from '@/components/modal/EventModal';
import {
  useEventsQuery,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  Event,
  EventInput,
} from '@/lib/hooks/useEventApi';

export default function CalendarView() {
  const { data: apiEvents = [], isLoading } = useEventsQuery();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [selectedDate, setSelectedDate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setEditEvent(null);
    setModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventClick = (clickInfo: any) => {
    const clicked = apiEvents.find((e) => e.id === clickInfo.event.id);
    if (clicked) {
      setEditEvent(clicked);
      setSelectedDate(clicked.solarDate);
      setModalOpen(true);
    }
  };

  const handleAddOrUpdateEvent = (title: string, isLunar: boolean) => {
    const solarDate = new Date(selectedDate);
    const lunarDateObj = new LunarDate(solarDate);
  
    const input: EventInput = {
      title,
      description: '',
      isLunar,
      solarDate: solarDate.toISOString(),
      lunarDate: `${lunarDateObj.getYear()}-${lunarDateObj.getMonth().toString().padStart(2,'0')}-${lunarDateObj.getDate()}`,
      reminderMinutesBefore: 0,
      googleCalendarEventId: null,
    };
  
    if (editEvent) {
      updateEvent.mutate({ id: editEvent.id, data: input });
    } else {
      createEvent.mutate(input);
    }
  
    setModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xoá sự kiện này không?')) {
      deleteEvent.mutate(id);
      setModalOpen(false);
    }
  };

  const formatEventsForCalendar = (events: Event[]) => {

    const result =  events.map((e) => ({
      id: e.id,
      title: e.isLunar ? e.title + ' (Âm)' : e.title,
      date: e.solarDate,
      backgroundColor: e.isLunar ? '#fff3cd' : '#cce5ff',
      borderColor: e.isLunar ? '#ffeeba' : '#b8daff',
      textColor: '#000000',
      allDay: true,
    }));
    return result;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {isLoading ? (
        <div>Đang tải sự kiện...</div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={formatEventsForCalendar(apiEvents)}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          eventDisplay="block"
          dayCellContent={(arg) => {
            const solar = new Date(arg.date);
            const lunar = new LunarDate(solar);
            const lunarDay = lunar.date;
            const lunarMonth = lunar.month;

            let lunarClass = 'text-gray-400';
            if (lunarDay === 1) lunarClass = 'text-red-600 font-bold';
            else if (lunarDay === 15) lunarClass = 'text-orange-500 font-semibold';

            return (
              <div className="flex flex-col items-center">
                <div className="text-base font-semibold">{arg.dayNumberText}</div>
                <div className={`text-xs ${lunarClass}`}>
                  {lunarDay}/{lunarMonth}
                </div>
              </div>
            );
          }}
        />
      )}

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddOrUpdate={handleAddOrUpdateEvent}
        onDelete={(id) => handleDeleteEvent(id)}
        // date={selectedDate}
        event={editEvent}
      />
    </div>
  );
}
