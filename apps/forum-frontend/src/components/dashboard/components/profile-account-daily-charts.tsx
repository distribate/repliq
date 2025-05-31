import { ChartContainer, type ChartConfig, ChartTooltipContent, ChartTooltip } from "@repo/ui/src/components/chart.tsx";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ProfileAccountStatsChartsProps } from "./profile-account-stats-charts";

export  const ProfileAccountStatsDailyCharts = ({
  charts
}: ProfileAccountStatsChartsProps) => {
  const chartConfig = charts?.views_by_day
    ? {
      views_by_day: {
        label: "Просмотры профиля",
        color: "#5CC85C",
      },
    } satisfies ChartConfig
    : null;

  const chartData = charts.views_by_day

  return (
    chartConfig && (
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={value => value.split(' ')[1]}
          />
          <YAxis
            orientation="right"
            interval="preserveStartEnd"
            domain={['auto', 'auto']}
            tickFormatter={value => {
              const roundedValue = Math.round(value);
              return roundedValue.toString()
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="dot"
                labelKey={chartConfig.views_by_day.label}
                formatter={v => [`${v} просмотров`, ""]}
              />
            }
          />
          <Bar dataKey="count" fill={chartConfig.views_by_day.color} radius={4} />
        </BarChart>
      </ChartContainer>
    )
  )
}