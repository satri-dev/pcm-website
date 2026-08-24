"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { contentByCollection } from "../../data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = contentByCollection.map((item) => ({
  name: item.label,
  count: item.value,
}))

const chartConfig = {
  count: {
    label: "Items",
    color: "#21409a",
  },
} satisfies ChartConfig

export default function ContentByCollection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content by Collection</CardTitle>
        <CardDescription>
          {contentByCollection.length} content types &middot; {contentByCollection.reduce((sum, i) => sum + i.value, 0)} total items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 16 ? value.slice(0, 16) + "..." : value
              }
            />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
