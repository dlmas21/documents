import type { NextRequest } from 'next/server';
import type { ICalendarEvent } from 'src/types/calendar';

import { NextResponse } from 'next/server';

import { _mock } from 'src/_mock/_mock';
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

// ----------------------------------------------------------------------

// Generate mock calendar events
function generateMockEvents(): ICalendarEvent[] {
  return Array.from({ length: 15 }, (_, index) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + index);
    startDate.setHours(9 + (index % 8), 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + (index % 3) + 1);

    const allDay = index % 4 === 0;

    return {
      id: _mock.id(index),
      color: CALENDAR_COLOR_OPTIONS[index % CALENDAR_COLOR_OPTIONS.length],
      title: _mock.eventNames(index),
      allDay,
      description: _mock.description(index),
      start: allDay ? startDate.toISOString().split('T')[0] : startDate.toISOString(),
      end: allDay ? endDate.toISOString().split('T')[0] : endDate.toISOString(),
    };
  });
}

// ----------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const events = generateMockEvents();

    return NextResponse.json({
      events,
    });
  } catch (error) {
    console.error('Get calendar events error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventData } = body;

    // In a real app, you would save the event to a database
    // For now, just return success
    return NextResponse.json({
      success: true,
      event: eventData,
    });
  } catch (error) {
    console.error('Create calendar event error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventData } = body;

    // In a real app, you would update the event in a database
    return NextResponse.json({
      success: true,
      event: eventData,
    });
  } catch (error) {
    console.error('Update calendar event error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    // In a real app, you would delete the event from a database
    return NextResponse.json({
      success: true,
      eventId,
    });
  } catch (error) {
    console.error('Delete calendar event error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

