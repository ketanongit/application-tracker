"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryData {
  companyType: string;
  count: number;
}

interface CategoryDistributionProps {
  data: CategoryData[];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF7300',
  '#00FF88', '#FF0088'
];

export default function CategoryDistribution({ data }: CategoryDistributionProps) {
  // Transform data for better display and ensure count is a number
  const chartData = data.map(item => ({
    name: item.companyType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: Number(item.count), // Ensure it's a number, not string
    companyType: item.companyType
  }));

  const totalApplications = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.payload.name}</p>
          <p className="text-blue-600">
            Applications: <span className="font-bold">{data.value}</span>
          </p>
          <p className="text-gray-500 text-sm">
            {((data.value / totalApplications) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0 || totalApplications === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={0} // Make it a full pie, not donut
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => 
                  percent && percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => (
                  <span style={{ fontSize: '12px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats below chart */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Categories:</span>
            <span className="font-semibold ml-2">{chartData.length}</span>
          </div>
          <div>
            <span className="text-gray-500">Total Applications:</span>
            <span className="font-semibold ml-2">{totalApplications}</span>
          </div>
        </div>

        {/* Breakdown by category */}
        <div className="mt-4 space-y-2">
          {chartData.map((item, index) => (
            <div key={item.companyType} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </div>
              <div className="flex gap-4">
                <span className="font-semibold">{item.value}</span>
                <span className="text-gray-500">
                  {((item.value / totalApplications) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
