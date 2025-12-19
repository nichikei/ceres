//src/services/eventStorage.ts
/**
 * Local storage service for calendar events
 * Manages CRUD operations for calendar events using AsyncStorage
 */

export type EventCategory = 'meal' | 'workout' | 'appointment';

export interface CalendarEvent {
    id: string;
    title: string;
    category: EventCategory;
    date: Date;
    time: string;
    notes?: string;
}

class EventStorageService {
    private STORAGE_KEY = '@health_calendar_events';

    async getEvents(): Promise<CalendarEvent[]> {
        // Mock implementation - replace with actual AsyncStorage later
        return [];
    }

    async addEvent(event: CalendarEvent): Promise<void> {
        // TODO: Implement AsyncStorage logic
        console.log('Event added:', event);
    }

    async deleteEvent(eventId: string): Promise<void> {
        // TODO: Implement AsyncStorage logic
        console.log('Event deleted:', eventId);
    }
}

export const eventStorage = new EventStorageService();
