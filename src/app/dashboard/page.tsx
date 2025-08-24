import { getApplicationsWithStats } from "@/app/actions/application";
import ApplicationsTable from "@/components/ApplicationTable";
import ApplicationForm from "@/components/ApplicationForm";
import DailyTargetForm from "@/components/DailyTargetForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function DashboardPage() {
  const { applications, dailyStats, statusStats, companyTypeStats } = await getApplicationsWithStats();

  const totalApplications = applications.length;
  const todayApplications = applications.filter(
    app => new Date(app.appliedDate).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Application Tracker</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayApplications}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalApplications ? Math.round((applications.filter(a => a.status === "PROCEEDED").length / totalApplications) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applications.filter(a => a.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="add-application">Add Application</TabsTrigger>
          <TabsTrigger value="daily-target">Daily Target</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationsTable applications={applications} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-application">
          <ApplicationForm />
        </TabsContent>
        
        <TabsContent value="daily-target">
          <div className="flex justify-center">
            <DailyTargetForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
