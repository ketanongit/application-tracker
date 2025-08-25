"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  date: string;
  count: number;
}

interface ApplicationChartProps {
  data: ChartData[];
}

export default function ApplicationChart({ data }: ApplicationChartProps) {
  // Transform and sort data
  const chartData = data
    .map(item => ({
      date: item.date,
      count: Number(item.count), // Ensure it's a number
      formattedDate: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30); // Show last 30 days

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
          <p className="text-blue-600">
            Applications: <span className="font-bold">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Application Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate proper stats
  const totalApplications = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate average based on actual days with applications (not all days in range)
  const daysWithApplications = chartData.filter(item => item.count > 0).length;
  const averagePerActiveDay = daysWithApplications > 0 
    ? (totalApplications / daysWithApplications).toFixed(1) 
    : "0";
  
  // Find the best day (highest count)
  const bestDay = chartData.reduce((max, item) => 
    item.count > max.count ? item : max, chartData[0]
  );
  
  const bestDayFormatted = new Date(bestDay.date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Application Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorApplications)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats below chart */}
        <div className="grid grid-cols-3 gap-4 text-sm border-t pt-4">
          <div className="text-center">
            <div className="text-gray-500">Total</div>
            <div className="font-bold text-lg">{totalApplications}</div>
            <div className="text-xs text-gray-400">applications</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Daily Avg</div>
            <div className="font-bold text-lg">{averagePerActiveDay}</div>
            <div className="text-xs text-gray-400">per active day</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Best Day</div>
            <div className="font-bold text-lg">{bestDay.count}</div>
            <div className="text-xs text-gray-400">{bestDayFormatted}</div>
          </div>
        </div>

        {/* Additional insights */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-500 border-t pt-3">
          <div>
            <span>Active Days: </span>
            <span className="font-semibold">{daysWithApplications}</span>
            <span> out of {chartData.length}</span>
          </div>
          <div>
            <span>Last 7 Days: </span>
            <span className="font-semibold">
              {chartData.slice(-7).reduce((sum, item) => sum + item.count, 0)}
            </span>
            <span> applications</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
