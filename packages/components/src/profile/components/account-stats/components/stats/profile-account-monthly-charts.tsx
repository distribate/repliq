import { ChartContainer, type ChartConfig, ChartTooltipContent, ChartTooltip } from "@repo/ui/src/components/chart.tsx";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format } from "date-fns"
import { ru } from "date-fns/locale";
import { ProfileAccountStatsChartsProps } from "./profile-account-stats-charts";

export const ProfileAccountStatsMonthlyCharts = ({
  charts
}: ProfileAccountStatsChartsProps) => {
  const chartConfig = charts?.views_by_month
    ? {
      views_by_month: {
        label: "Просмотры профиля",
        color: "#5CC85C",
      },
    } satisfies ChartConfig
    : null;

  const chartData = charts.views_by_month

  return (
    chartConfig && (
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value, index) => {
              if (index % 5 === 0) {
                const date = new Date(value);
                return format(date, 'd MMM', { locale: ru });
              }

              return ""
            }}
          />
          <YAxis
            orientation="right"
            interval="preserveStartEnd"
            domain={['auto', 'auto']}
            tickFormatter={value => {
              const roundedValue = Math.round(value);
              return roundedValue.toString();
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="dot"
                labelKey={chartConfig.views_by_month.label}
                formatter={(value, name, props) => {
                  const day = format(props.payload.day, 'd MMMM', { locale: ru })

                  return [
                    `${day}: ${value} просмотров`,
                    "",
                  ]
                }}
              />
            }
          />
          <Bar dataKey="count" fill={chartConfig.views_by_month.color} radius={4} />
        </BarChart>
      </ChartContainer>
    )
  )
}