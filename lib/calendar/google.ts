/**
 * Google Calendar Integration
 * Creates calendar events for property viewing appointments
 * 
 * Uses Google Calendar API with OAuth2 refresh token authentication
 */

import { google } from 'googleapis';

export interface CalendarEventData {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  attendeeEmail?: string;
  attendeeName?: string;
}

export interface CalendarEventResult {
  success: boolean;
  eventId?: string;
  eventUrl?: string;
  error?: string;
}

/**
 * Creates a Google Calendar OAuth2 client using refresh token
 */
function getGoogleCalendarClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Calendar credentials not configured. Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REFRESH_TOKEN');
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'urn:ietf:wg:oauth:2.0:oob' // Redirect URI for installed apps
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Creates a Google Calendar event using Google Calendar API
 * 
 * @param eventData - Event data including title, description, location, times, etc.
 * @returns Promise with success status, event ID, and event URL
 */
export async function createGoogleCalendarEvent(
  eventData: CalendarEventData
): Promise<CalendarEventResult> {
  try {
    // Verifica che le credenziali siano configurate
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
      console.warn('[GOOGLE CALENDAR] Credentials not configured, skipping calendar event creation');
      return {
        success: false,
        error: 'Google Calendar credentials not configured',
      };
    }

    const calendar = getGoogleCalendarClient();

    // Formatta le date per Google Calendar API (RFC3339 format)
    const startDateTime = eventData.startTime.toISOString();
    const endDateTime = eventData.endTime.toISOString();

    // Crea l'evento con tutti i dettagli
    const event = {
      summary: eventData.title,
      description: eventData.description,
      location: eventData.location,
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/Rome', // Default timezone, può essere reso configurabile
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Europe/Rome',
      },
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'email',
            minutes: 1440, // 24 ore prima
          },
          {
            method: 'popup',
            minutes: 30, // 30 minuti prima (come richiesto)
          },
        ],
      },
      // Aggiungi attendee se presente
      ...(eventData.attendeeEmail && {
        attendees: [
          {
            email: eventData.attendeeEmail,
            displayName: eventData.attendeeName || undefined,
          },
        ],
      }),
    };

    // Inserisci l'evento nel calendario principale
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    const createdEvent = response.data;

    if (createdEvent.id && createdEvent.htmlLink) {

      return {
        success: true,
        eventId: createdEvent.id,
        eventUrl: createdEvent.htmlLink,
      };
    } else {
      throw new Error('Event created but no ID or URL returned');
    }

  } catch (error: any) {
    console.error('[GOOGLE CALENDAR] Error creating event:', error);
    
    // Gestisci errori specifici
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return {
        success: false,
        error: 'Network error: Unable to reach Google Calendar API',
      };
    }
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: 'Authentication error: Invalid or expired refresh token',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to create calendar event',
    };
  }
}

/**
 * Generates calendar event data from appointment information
 * 
 * @param propertyTitle - Title of the property
 * @param propertyLocation - Location/address of the property
 * @param ownerName - Name of the property owner
 * @param ownerPhone - Phone number of the owner
 * @param ownerEmail - Email of the owner (optional)
 * @param dashboardUrl - URL to the PropertyPilot dashboard for this listing
 */
export function generateAppointmentCalendarEvent(
  propertyTitle: string,
  propertyLocation: string,
  ownerName: string | null,
  ownerPhone: string | null,
  ownerEmail: string | null,
  dashboardUrl: string
): CalendarEventData {
  // Default: 2 days from now at 10:00 AM
  const startTime = new Date();
  startTime.setDate(startTime.getDate() + 2);
  startTime.setHours(10, 0, 0, 0);

  // Duration: 1 hour
  const endTime = new Date(startTime);
  endTime.setHours(11, 0, 0, 0);

  // Formatta la descrizione con tutti i dettagli del proprietario
  const description = `
🎯 VISITA IMMOBILE - PropertyPilot AI

📍 IMMOBILE:
${propertyTitle}
${propertyLocation}

👤 PROPRIETARIO:
${ownerName || 'N/A'}
${ownerPhone ? `📞 ${ownerPhone}` : ''}
${ownerEmail ? `📧 ${ownerEmail}` : ''}

🔗 DASHBOARD:
${dashboardUrl}

---
Generato automaticamente da PropertyPilot AI
Tutti i dettagli sono disponibili nella dashboard.
  `.trim();

  return {
    title: `PROFILOT AI: Visita per ${propertyTitle}`, // Titolo come richiesto
    description,
    location: propertyLocation,
    startTime,
    endTime,
    attendeeEmail: ownerEmail || undefined,
    attendeeName: ownerName || undefined,
  };
}

