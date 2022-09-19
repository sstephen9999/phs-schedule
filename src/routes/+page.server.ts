import { error } from "@sveltejs/kit";
import db from "../firebase/db";

import { getDoc, doc } from "firebase/firestore";
import { getDateEST, convertToMilitaryTime, getDate } from "../utils/time";
import calendar from "../calendar.json";

interface Schedule {
  [period: string]: {
    start_time: string;
    end_time: string;
  };
}

const getSchedule = async (scheduleType: string) => {
  const scheduleRef = doc(db, "schedules", scheduleType);
  const scheduleDoc = await getDoc(scheduleRef);

  if (scheduleDoc.exists()) {
    let schedule: Schedule = scheduleDoc.data();

    schedule = Object.fromEntries(
      Object.entries(schedule).sort((a, b) => {
        return (
          convertToMilitaryTime(a[1].start_time) -
          convertToMilitaryTime(b[1].start_time)
        );
      })
    );

    return schedule;
  } else {
    throw error(404, "Not found");
  }
};

const getNextSchoolStartDate = async () => {
  let date = getDateEST();
  date = new Date(date.getTime() + 86400000);

  let nextDate = `${date.getMonth() + 1}/${date.getDate()}`;

  while (!(nextDate in calendar)) {
    date = new Date(date.getTime() + 86400000);
    nextDate = `${date.getMonth() + 1}/${date.getDate()}`;

    if (date.getFullYear() === 2024) {
      throw error(404, "No more school days");
    }
  }

  const schedule = await getSchedule(
    calendar[nextDate as keyof typeof calendar]
  );

  const start_time = Object.entries(schedule)[0][1].start_time;
  date = getDate(start_time, date);
  return date;
};

/** @type {import('./$types').PageLoad} */
export async function load() {
  let date = getDateEST();
  const dateToday = `${date.getMonth() + 1}/${date.getDate()}`;
  const nextSchoolStartTime = await getNextSchoolStartDate();

  if (!(dateToday in calendar)) {
    return {
      scheduleType: "No School",
      nextSchoolStartTime,
    };
  }

  const scheduleType = calendar[dateToday as keyof typeof calendar];

  const schedule = await getSchedule(scheduleType);

  return {
    schedule,
    scheduleType,
    nextSchoolStartTime,
  };
}
