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

function editReminderTime(
  reminderFrequency: ReminderFrequency,
  reminderTime: Dayjs,
  reminderDay: Weekday,
  reminderDate: number
) {
  // depending on the reminder frequency, we need to set the reminder time

  if (reminderFrequency === ReminderFrequency.Daily) {
    // start reminders on next day if Daily
    reminderTime = reminderTime.date(reminderTime.date() + 1);
  } else if (reminderFrequency === ReminderFrequency.Weekly) {
    // if not Sunday, just add reminderDay days, and change the day
    if (reminderTime.day() !== (Weekday.Sunday + 1) % 7) {
      reminderTime = reminderTime.add(reminderDay, "day");
    } else {
      // if Sunday, add 1, then add reminderDay days, and change the day
      reminderTime = reminderTime.add(1, "day").add(reminderDay, "day");
    }
  } else if (reminderFrequency === ReminderFrequency.Monthly) {
    // if reminderDate has already passed (or is today), add 1 month
    if (reminderTime.date() >= reminderDate) {
      reminderTime = reminderTime.add(1, "month");
    } else {
      reminderTime = reminderTime.date(reminderDate);
    }
  }

  return reminderTime;
}

function createRecurrenceRule(
  timesToAchieve: number,
  reminderFrequency: ReminderFrequency,
  reminderTime: Dayjs
) {
  // we create the recurrence rule according to RFC 5545
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

  return recurrenceRule;
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
  const correctReminderTime: Dayjs = editReminderTime(
    reminderFrequency,
    reminderTime,
    reminderDay,
    reminderDate
  );

  // create the recurrence rule according to RFC 5545
  const recurrenceRule: string = createRecurrenceRule(
    timesToAchieve,
    reminderFrequency,
    correctReminderTime
  );

  // create event object as per API docs
  const event: GoalEvent = {
    summary: `Resolution: ${description}`,
    start: {
      dateTime: correctReminderTime.toISOString(),
      timeZone: "Europe/London",
    },
    end: {
      dateTime: correctReminderTime.add(1, "hour").toISOString(),
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

async function deleteGoalEvent(eventId: string) {
  const deleteResult = await apiCalendar.deleteEvent(eventId);

  return deleteResult;
}

export { createGoalEvent, deleteGoalEvent };
