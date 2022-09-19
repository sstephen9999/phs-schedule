<script>
  /** @type {import('./$types').PageData} */
  export let data;
  const { schedule, scheduleType } = data;

  import {
    formatTime,
    getDate,
    getDateEST,
    isCurrentlySchool,
  } from "../utils/time";

  import { onMount } from "svelte";
  import JSConfetti from "js-confetti";

  // @ts-ignore
  let jsConfetti = null;
  onMount(() => {
    jsConfetti = new JSConfetti();
  });

  const getCurrentPeriod = () => {
    if (schedule) {
      const school_start_time = Object.entries(schedule)[0][1].start_time;
      const school_end_time =
        Object.entries(schedule)[Object.entries(schedule).length - 1][1]
          .end_time;

      if (!isCurrentlySchool(school_start_time, school_end_time)) {
        return "No School";
      }
      const date = getDateEST();
      for (const period in schedule) {
        const { start_time, end_time } = schedule[period];

        const start_date = getDate(start_time);
        const end_date = getDate(end_time);

        if (start_date < date && date < end_date) {
          return period;
        }
      }

      return "Transition";
    }
    return "No School";
  };

  const getCountdown = () => {
    if (currentPeriod === "No School" || !schedule) {
      return data.nextSchoolStartTime;
    }

    if (currentPeriod === "Transition") {
      const date = getDateEST();
      Object.entries(schedule).forEach(([period, { start_time }]) => {
        const start_date = getDate(start_time);
        if (start_date > date) {
          return getDate(start_time);
        }
      });
    }
    return getDate(schedule[currentPeriod].end_time);
  };

  let currentPeriod = getCurrentPeriod();
  let countdown = getCountdown();
  let timeDifference = countdown.getTime() - getDateEST().getTime();
  let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeDifference / 1000 / 60 / 60) % 24);
  let minutes = Math.floor((timeDifference / 1000 / 60) % 60);
  let seconds = Math.floor((timeDifference / 1000) % 60);

  setInterval(() => {
    timeDifference -= 1000;
    days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    hours = Math.floor((timeDifference / 1000 / 60 / 60) % 24);
    minutes = Math.floor((timeDifference / 1000 / 60) % 60);
    seconds = Math.floor((timeDifference / 1000) % 60);

    if (timeDifference <= 0) {
      currentPeriod = getCurrentPeriod();
      countdown = getCountdown();
      timeDifference = countdown.getTime() - getDateEST().getTime();
      // @ts-ignore
      if (jsConfetti) {
        jsConfetti.addConfetti();
      }
    }
  }, 1000);
</script>

<main class="max-w-screen-md mx-auto pt-8 px-2">
  <h1 class="font-bold text-4xl">PHS Schedule</h1>
  <div class="mt-6">
    <h2 class="text-2xl">Today's Schedule</h2>
    <h2 class="text-2xl font-bold">{scheduleType}</h2>
  </div>
  <div class="mt-2">
    <h2 class="text-2xl">Current Period</h2>
    <h2 class="text-2xl font-bold">{currentPeriod}</h2>
  </div>
  <div class="mt-2">
    {#if currentPeriod == "No School"}
      <h2 class="text-2xl">Time Until School Starts</h2>
    {:else}
      <h2 class="text-2xl">Time Until {currentPeriod} Ends</h2>
    {/if}
    <h1 class="font-bold text-3xl">
      {#if days > 0}
        <span>{days} {seconds != 1 ? "days" : "day"}</span>
      {/if}
      {#if hours > 0}
        <span>{hours} {hours != 1 ? "hours" : "hour"}</span>
      {/if}
      <span>{minutes} {minutes != 1 ? "minutes" : "minute"}</span>
      <span>{seconds} {seconds != 1 ? "seconds" : "second"}</span>
    </h1>
  </div>
  {#if schedule}
    <div class="mt-4">
      <div class="flex justify-between">
        <h1 class="text-3xl font-bold">Period</h1>
        <h1 class="text-3xl font-bold">Time</h1>
      </div>

      {#each Object.entries(schedule) as [period, time]}
        <div class="flex justify-between">
          <h1 class="text-3xl">{period}</h1>
          <div class="flex gap-2">
            <h2 class="text-2xl">{formatTime(time.start_time)}</h2>
            <h2 class="text-2xl">-</h2>
            <h2 class="text-2xl">{formatTime(time.end_time)}</h2>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  <div class='mt-4'>
    <h3>Created by Stephen Shkeda</h3>
    <h3>Version 1.0</h3>

  </div>
</main>
