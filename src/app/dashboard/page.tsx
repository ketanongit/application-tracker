import { getApplicationsWithStats } from "@/app/actions/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCards from "@/components/StatsCard";
import CategoryDistribution from "@/components/CategoryDistribution";
import ApplicationChart from "@/components/ApplicationChart";
import Link from "next/link";

export default async function DashboardPage() {
  const { applications, dailyStats, statusStats, companyTypeStats } = await getApplicationsWithStats();

  return (
    <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
      <h1 className="text-3xl font-bold">Job Application Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Link 
          href="/application" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center whitespace-nowrap"
        >
          Add Application
        </Link>
        <Link 
          href="/quick-addition" 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center whitespace-nowrap"
        >
          Quick Add
        </Link>
      </div>
    </div>


      {/* Stats Cards */}
      <StatsCards applications={applications} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ApplicationChart data={dailyStats} />
        <CategoryDistribution data={companyTypeStats} />
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {companyTypeStats.map((category) => (
          <Link key={category.companyType} href={`/category-wise/${category.companyType}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{category.companyType.replace('_', ' ')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{category.count}</div>
                <p className="text-xs text-muted-foreground">applications</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Applications Preview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Applications</CardTitle>
            <Link 
              href="/category-wise/all" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Company</th>
                  <th className="text-left py-2">Position</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
                  <tr key={app.id} className="border-b">
                    <td className="py-2">{app.companyName}</td>
                    <td className="py-2">{app.position}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-2">{new Date(app.appliedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
