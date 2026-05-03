/**
 * Cal.com Integration — Calendar booking for viewings
 * https://cal.com/docs/api
 *
 * Used by voice pathways to check availability and book viewings.
 */

const CAL_BASE = "https://api.cal.com/v1";

function getApiKey(): string {
  const key = process.env.CAL_COM_API_KEY;
  if (!key) throw new Error("CAL_COM_API_KEY not configured");
  return key;
}

export interface CalSlot {
  time: string; // ISO 8601
  duration: number; // minutes
  available: boolean;
}

export interface CalBooking {
  id: number;
  uid: string;
  title: string;
  start: string;
  end: string;
  attendees: Array<{ name: string; email: string }>;
  status: string;
}

/**
 * Get available slots for a specific event type on a date range
 */
export async function getAvailableSlots(
  eventTypeId: number,
  startDate: string,
  endDate: string
): Promise<CalSlot[]> {
  const params = new URLSearchParams({
    apiKey: getApiKey(),
    startTime: startDate,
    endTime: endDate,
  });

  const res = await fetch(`${CAL_BASE}/availability?eventTypeId=${eventTypeId}&${params}`);
  if (!res.ok) return [];
  const data = await res.json();

  const slots: CalSlot[] = [];
  for (const [, daySlots] of Object.entries(data.slots || data.dateOverrides || {})) {
    for (const slot of daySlots as Array<{ time: string }>) {
      slots.push({ time: slot.time, duration: 30, available: true });
    }
  }
  return slots;
}

/**
 * Book a slot
 */
export async function bookSlot(
  eventTypeId: number,
  start: string,
  attendee: { name: string; email: string; phone?: string },
  notes?: string
): Promise<CalBooking> {
  const res = await fetch(`${CAL_BASE}/bookings?apiKey=${getApiKey()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventTypeId,
      start,
      responses: {
        name: attendee.name,
        email: attendee.email,
        phone: attendee.phone || "",
        notes: notes || "",
      },
      timeZone: "Europe/Rome",
      language: "en",
      metadata: { source: "propertypilot-voice-agent" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cal.com booking failed: ${res.status} ${err}`);
  }

  return await res.json();
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: number, reason?: string): Promise<void> {
  await fetch(`${CAL_BASE}/bookings/${bookingId}/cancel?apiKey=${getApiKey()}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason: reason || "Cancelled by PropertyPilot" }),
  });
}

/**
 * List upcoming bookings
 */
export async function listBookings(status: "upcoming" | "past" = "upcoming"): Promise<CalBooking[]> {
  const res = await fetch(`${CAL_BASE}/bookings?apiKey=${getApiKey()}&status=${status}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.bookings || [];
}
