// src/routes/calendar.js
/**
 * Calendar event routes for Module 5
 * Handles all calendar-related API endpoints
 */

import express from 'express';
import {
    getEvents,
    getEventsByDate,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/calendarController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Calendar event endpoints
router.get('/events', getEvents);
router.get('/events/date', getEventsByDate);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;
