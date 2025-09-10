import type { ProfileViewsDetails } from "@repo/types/routes-types/get-user-profile-stats-types";
import dayjs from "@repo/shared/constants/dayjs-instance"

type PrepareChartsData = {
  details: ProfileViewsDetails[]
  with_missing: boolean
}

type DailyChartType = {
  hour: string;
  count: number
}

type MonthlyChartType = {
  day: string;
  count: number
}

function fillMissingHours(chartData: Array<DailyChartType>): Array<DailyChartType> {
  const result: Array<DailyChartType> = [];

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  for (let i = 0; i < 24; i++) {
    const currentHour = new Date(startOfDay);
    currentHour.setHours(i);

    const formattedHour = dayjs(currentHour).format("YYYY-MM-DD HH");

    const existingData = chartData.find((data) => data.hour === formattedHour);

    result.push({
      hour: formattedHour,
      count: existingData ? existingData.count : 0,
    });
  }

  return result;
}

function fillMissingDays(
  chartData: Array<MonthlyChartType>,
): Array<MonthlyChartType> {
  const result: Array<MonthlyChartType> = [];

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0); 

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setUTCMonth(endOfMonth.getUTCMonth() + 1)
  endOfMonth.setUTCDate(0); 

  const chartDataMap = new Map(chartData.map(data => [data.day, data.count]));

  let currentDate = new Date(startOfMonth);

  while (currentDate <= endOfMonth) {
    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
    const count = chartDataMap.get(formattedDate) || 0;

    result.push({
      day: formattedDate,
      count,
    });

    currentDate.setUTCDate(currentDate.getUTCDate() + 1); 
  }

  return result;
}

export function prepareHourlyChartData({
  details, with_missing
}: PrepareChartsData) {
  const grouped = details.reduce((acc, detail) => {
    const hourKey = dayjs(detail.created_at).format("YYYY-MM-DD HH")

    if (!acc[hourKey]) {
      acc[hourKey] = 0;
    }

    acc[hourKey]++;

    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(grouped).map(([hour, count]) => ({
    hour, count
  }));

  if (with_missing) {
    return fillMissingHours(chartData)
  }

  return chartData;
}

export function prepareMonthlyChartData({
  details, with_missing
}: PrepareChartsData) {
  const grouped = details.reduce((acc, detail) => {
    const dateKey = dayjs(detail.created_at).format("YYYY-MM-DD");

    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }

    acc[dateKey]++;

    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(grouped).map(([day, count]) => ({
    day, count
  }));

  if (with_missing) {
    return fillMissingDays(chartData)
  }

  return chartData;
}