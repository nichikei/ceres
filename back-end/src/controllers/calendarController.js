// src/controllers/calendarController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all calendar events for a user
export const getEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: [
        { eventDate: 'asc' },
        { timeSlot: 'asc' }
      ]
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
};

// Get events for a specific date
export const getEventsByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.query; // Format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const events = await prisma.calendarEvent.findMany({
      where: {
        userId,
        eventDate: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { timeSlot: 'asc' }
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events by date:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Create a new calendar event
export const createEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, eventDate, timeSlot, category, location, note, linkedModule } = req.body;

    if (!title || !eventDate || !timeSlot || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const event = await prisma.calendarEvent.create({
      data: {
        userId,
        title,
        eventDate: new Date(eventDate),
        timeSlot,
        category,
        location,
        note,
        linkedModule
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
};

// Update a calendar event
export const updateEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, eventDate, timeSlot, category, location, note, linkedModule } = req.body;

    // Check if event exists and belongs to user
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: { id: parseInt(id), userId }
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = await prisma.calendarEvent.update({
      where: { id: parseInt(id) },
      data: {
        title,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        timeSlot,
        category,
        location,
        note,
        linkedModule
      }
    });

    res.json(event);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ error: 'Failed to update calendar event' });
  }
};

// Delete a calendar event
export const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if event exists and belongs to user
    const existingEvent = await prisma.calendarEvent.findFirst({
      where: { id: parseInt(id), userId }
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await prisma.calendarEvent.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ error: 'Failed to delete calendar event' });
  }
};
