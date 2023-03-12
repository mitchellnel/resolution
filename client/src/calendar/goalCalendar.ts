import dayjs, { Dayjs } from "dayjs";

import apiCalendar from "./googleCalendar";
import { ReminderFrequency, Weekday } from "../types";

interface GoalEvent {
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence: string[];
  reminders: {
    useDefault: boolean;
    overrides: {
      method: string;
      minutes: number;
    }[];
  };
}

async function createGoalEvent(
  description: string,
  timesToAchieve: number,
  reminderFrequency: ReminderFrequency,
  reminderTime: Dayjs,
  reminderDay: Weekday,
  reminderDate: number
) {
  // use information to set up the reminder date + time
  if (reminderFrequency === ReminderFrequency.Daily) {
    // start reminders on next day
    reminderTime = reminderTime.date(reminderTime.date() + 1);
  }

  // set up recurrence rule according to RFC 5545
  let recurrenceRule = "RRULE:FREQ=";
  let endTime = dayjs();
  if (reminderFrequency === ReminderFrequency.Daily) {
    recurrenceRule += "DAILY";

    endTime = reminderTime.add(timesToAchieve, "day");
  } else if (reminderFrequency === ReminderFrequency.Weekly) {
    recurrenceRule += "WEEKLY";

    endTime = reminderTime.add(timesToAchieve, "week");
  } else if (reminderFrequency === ReminderFrequency.Monthly) {
    recurrenceRule += "MONTHLY";

    endTime = reminderTime.add(timesToAchieve, "month");
  }

  recurrenceRule += `;UNTIL=${
    String(endTime.year()) +
    (String(endTime.month() + 1).length === 1
      ? "0" + String(endTime.month() + 1)
      : String(endTime.month() + 1)) +
    String(endTime.date())
  }T000000Z`;

  // create event object as per API docs
  const event: GoalEvent = {
    summary: `Resolution: ${description}`,
    start: {
      dateTime: reminderTime.toISOString(),
      timeZone: "Europe/London",
    },
    end: {
      dateTime: reminderTime.add(1, "hour").toISOString(),
      timeZone: "Europe/London",
    },
    recurrence: [recurrenceRule],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 30 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  // add the reminder to the user's calendar
  const createResult = await apiCalendar.createEvent({
    start: event.start,
    end: event.end,
  });

  // update the event with our custom settings
  await apiCalendar.updateEvent(event, createResult.result.id);

  return createResult.result.id;
}

export { createGoalEvent };
