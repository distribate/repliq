import { ChartContainer, type ChartConfig, ChartTooltipContent, ChartTooltip } from "@repo/ui/src/components/chart.tsx";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import dayjs from "@repo/shared/constants/dayjs-instance"
import { AccountStatsChartsProps } from "./account-stats-charts";

export const AccountStatsMonthlyCharts = ({
  charts
}: AccountStatsChartsProps) => {
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
                return dayjs(date).format('d MMM');
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
                  const day = dayjs(props.payload.day).format('d MMMM')

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