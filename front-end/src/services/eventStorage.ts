// src/services/eventStorage.ts
import { api } from './api';
import { format } from 'date-fns';

export type EventCategory = 'meal' | 'workout' | 'appointment';

export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: Date;
  time: string;
  notes?: string;
}

// Helper function to convert API response to CalendarEvent
const convertApiEvent = (apiEvent: any): CalendarEvent => {
  // Map API category to local category
  const categoryMap: { [key: string]: EventCategory } = {
    'meal': 'meal',
    'activity': 'workout',
    'appointment': 'appointment',
  };

  return {
    id: apiEvent.id.toString(),
    title: apiEvent.title,
    category: categoryMap[apiEvent.category] || 'appointment',
    date: new Date(apiEvent.eventDate),
    time: apiEvent.timeSlot,
    notes: apiEvent.note,
  };
};

// Helper function to convert CalendarEvent to API format
const convertToApiFormat = (event: Partial<CalendarEvent>) => {
  // Map local category to API category
  const categoryMap: { [key: string]: string } = {
    'meal': 'meal',
    'workout': 'activity',
    'appointment': 'appointment',
  };

  return {
    title: event.title,
    eventDate: event.date ? format(event.date, 'yyyy-MM-dd\'T\'HH:mm:ss') : undefined,
    timeSlot: event.time,
    category: event.category ? categoryMap[event.category] : undefined,
    note: event.notes,
  };
};

export const eventStorage = {
  // Get all events
  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const apiEvents = await api.getCalendarEvents();
      return apiEvents.map(convertApiEvent);
    } catch (error) {
      console.error('Error loading events from API:', error);
      return [];
    }
  },

  // Add a new event
  async addEvent(event: CalendarEvent): Promise<void> {
    try {
      await api.createCalendarEvent(convertToApiFormat(event) as any);
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  },

  // Delete an event
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await api.deleteCalendarEvent(parseInt(eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Get events for a specific date
  async getEventsForDate(date: Date): Promise<CalendarEvent[]> {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const apiEvents = await api.getCalendarEventsByDate(dateStr);
      return apiEvents.map(convertApiEvent);
    } catch (error) {
      console.error('Error getting events for date:', error);
      return [];
    }
  },

  // Get today's events
  async getTodayEvents(): Promise<CalendarEvent[]> {
    return this.getEventsForDate(new Date());
  },
};
