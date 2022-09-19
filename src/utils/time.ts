export const getDateEST = () => {
  const date = new Date();

  const ESTDate = new Date(
    date.toLocaleString("en-US", {
      timeZone: "America/New_York",
    })
  );
  const timeDifference = date.getTime() - ESTDate.getTime();

  return new Date(date.getTime() - timeDifference);
};

export const convertToMilitaryTime = (time: string) =>
  parseInt(time.replace(/:/g, ""));

export const formatTime = (time: string) =>
  parseInt(time.split(":")[0]) > 12
    ? parseInt(time.split(":")[0]) - 12 + ":" + time.split(":")[1]
    : time;

export const getDate = (time: string, date = getDateEST()) => {
  // hour:minute => Date
  const time_hour = parseInt(time.split(":")[0]);
  const time_minute = parseInt(time.split(":")[1]);

  date.setHours(time_hour, time_minute, 0, 0);
  return date;
};

export const isCurrentlySchool = (
  school_start_time: string,
  school_end_time: string
) => {
  const date = getDateEST();
  const school_start_date = getDate(school_start_time);
  const school_end_date = getDate(school_end_time);

  return (
    date.getTime() >= school_start_date.getTime() &&
    date.getTime() <= school_end_date.getTime()
  );
};
