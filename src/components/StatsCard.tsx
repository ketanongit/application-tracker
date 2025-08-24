import { Application } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  applications: Application[];
}

export default function StatsCards({ applications }: StatsCardsProps) {
  const totalApplications = applications.length;
  
  const todayApplications = applications.filter(
    app => new Date(app.appliedDate).toDateString() === new Date().toDateString()
  ).length;
  
  const proceededApplications = applications.filter(a => a.status === "PROCEEDED").length;
  const successRate = totalApplications ? Math.round((proceededApplications / totalApplications) * 100) : 0;
  
  const pendingApplications = applications.filter(a => a.status === "PENDING").length;
  const rejectedApplications = applications.filter(a => a.status === "REJECTED").length;

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconColor: "text-blue-600"
    },
    {
      title: "Today's Applications", 
      value: todayApplications,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      iconColor: "text-green-600"
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      bgColor: "bg-purple-50", 
      textColor: "text-purple-700",
      iconColor: "text-purple-600"
    },
    {
      title: "Pending Applications",
      value: pendingApplications,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700", 
      iconColor: "text-yellow-600"
    },
    {
      title: "Rejected Applications",
      value: rejectedApplications,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconColor: "text-red-600"
    },
    {
      title: "Proceeded Applications", 
      value: proceededApplications,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      iconColor: "text-emerald-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} border-0`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.textColor}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
