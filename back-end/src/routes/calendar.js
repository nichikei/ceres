// src/routes/calendar.js
import express from 'express';
import * as calendarController from '../controllers/calendarController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all events for current user
router.get('/', calendarController.getEvents);

// Get events by date
router.get('/by-date', calendarController.getEventsByDate);

// Create new event
router.post('/', calendarController.createEvent);

// Update event
router.put('/:id', calendarController.updateEvent);

// Delete event
router.delete('/:id', calendarController.deleteEvent);

export default router;
