"use client"

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type GlobalSettings = { weather: "rain" | "clear" | "snow" }

const useWeather = () => {
  const isTodayWeatherDay = (weatherDays: dayjs.Dayjs[]): boolean => {
    const today = dayjs().startOf('day');
    return weatherDays.some((day) => day.isSame(today, 'day'));
  };

  const year = dayjs().year();

  const rainyDays = [
    dayjs(`${year}-03-05`), dayjs(`${year}-03-15`), dayjs(`${year}-04-10`),
    dayjs(`${year}-05-20`), dayjs(`${year}-09-12`), dayjs(`${year}-10-22`),
    dayjs(`${year}-11-08`), dayjs(`${year}-11-30`)
  ];

  const snowyDays = [
    dayjs(`${year}-01-05`), dayjs(`${year}-01-20`), dayjs(`${year}-02-10`),
    dayjs(`${year}-12-01`), dayjs(`${year}-12-15`), dayjs(`${year}-12-25`)
  ];

  const isRainyToday = isTodayWeatherDay(rainyDays);
  const isSnowyToday = isTodayWeatherDay(snowyDays);

  return {
    isRainyToday,
    isSnowyToday
  };
}

export const IntroLayout = ({ children }: { children: React.ReactNode }) => {
  const [weather, setWeather] = useState<GlobalSettings["weather"]>("clear")
  const { isRainyToday, isSnowyToday } = useWeather()

  useEffect(() => {
    if (isRainyToday) {
      setWeather("rain")
    } else if (isSnowyToday) {
      setWeather("snow")
    } else {
      setWeather("clear")
    }
  }, [isRainyToday, isSnowyToday])

  return (
    <div
      className={`flex flex-col items-start h-screen justify-center weather ${weather}`}
    >
      {children}
    </div>
  )
}