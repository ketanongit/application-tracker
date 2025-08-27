"use server";

import { db } from "@/db";
import { 
  Application, 
  applications as applicationsTable, 
  dailyApplications,
  NewApplication,
  companyTypeEnum,
  applicationStatusEnum,
  ReachoutMethodEnum,
  reachout_methods
} from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ApplicationWithReachout } from "@/db/schema";

export async function createApplication(formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const position = formData.get("position") as string;
  const companyType = formData.get("companyType") as typeof companyTypeEnum.enumValues[number];
  const jobDescription = formData.get("jobDescription") as string;
  const applicationUrl = formData.get("applicationUrl") as string;
  const notes = formData.get("notes") as string;

  try {
    await db.insert(applicationsTable).values({
      companyName,
      position,
      companyType,
      jobDescription: jobDescription || null,
      applicationUrl: applicationUrl || null,
      notes: notes || null,
      status: "APPLIED",
    });

    // Revalidate all affected paths
    revalidatePath("/dashboard");
    revalidatePath("/category-wise/all");
    revalidatePath(`/category-wise/${companyType}`);
    revalidatePath("/", "layout"); // Force revalidate entire app
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create application" };
  }
}

export async function updateApplicationStatus(
  applicationId: number,
  status: string,
  currentRound?: string,
  finalVerdict?: string
) {
  try {
    await db
      .update(applicationsTable)
      .set({
        status: status as typeof applicationStatusEnum.enumValues[number],
        currentRound,
        finalVerdict,
        updatedAt: new Date(),
      })
      .where(eq(applicationsTable.id, applicationId));

    // Revalidate all affected paths
    revalidatePath("/dashboard");
    revalidatePath("/category-wise/all");
    revalidatePath("/category-wise/[category]", "page"); // Dynamic route revalidation
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update application" };
  }
}

// Updated function to get applications with reach-out methods
export async function getApplicationsWithReachout(): Promise<ApplicationWithReachout[]> {
  try {
    const applications = await db
      .select()
      .from(applicationsTable)
      .orderBy(desc(applicationsTable.appliedDate));

    // Get reach-out methods for all applications
    const allReachoutMethods = await db
      .select()
      .from(reachout_methods);

    // Combine applications with their reach-out methods
    const applicationsWithReachout = applications.map(app => ({
      ...app,
      reachoutMethods: allReachoutMethods.filter(method => method.applicationId === app.id)
    }));

    return applicationsWithReachout;
  } catch (error) {
    console.error("Error fetching applications with reach-out methods:", error);
    return [];
  }
}

export async function createDailyTarget(date: string, count: number) {
  try {
    const targetDate = new Date(date);
    
    // Create the daily target
    await db.insert(dailyApplications).values({
      date: targetDate,
      plannedCount: count,
      actualCount: 0,
    });

    // Create placeholder applications for the day
    const placeholders: NewApplication[] = Array.from({ length: count }, (_, i) => ({
      companyName: `Placeholder ${i + 1}`,
      position: "To be filled",
      companyType: "OTHER",
      appliedDate: targetDate,
      status: "APPLIED",
      notes: "Created from daily target - please fill details",
    }));

    await db.insert(applicationsTable).values(placeholders);

    // Revalidate all affected paths
    revalidatePath("/dashboard");
    revalidatePath("/category-wise/all");
    revalidatePath("/category-wise/OTHER");
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create daily target" };
  }
}

export async function getApplicationsWithStats() {
  try {
    const allApplications: Application[] = await db
      .select()
      .from(applicationsTable)
      .orderBy(desc(applicationsTable.appliedDate));

    // Get daily application counts for chart
    const dailyStats = await db
      .select({
        date: sql<string>`DATE(${applicationsTable.appliedDate})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(applicationsTable)
      .groupBy(sql`DATE(${applicationsTable.appliedDate})`)
      .orderBy(sql`DATE(${applicationsTable.appliedDate})`);

    // Get status distribution
    const statusStats = await db
      .select({
        status: applicationsTable.status,
        count: sql<number>`COUNT(*)`,
      })
      .from(applicationsTable)
      .groupBy(applicationsTable.status);

    // Get company type distribution
    const companyTypeStats = await db
      .select({
        companyType: applicationsTable.companyType,
        count: sql<number>`COUNT(*)`,
      })
      .from(applicationsTable)
      .groupBy(applicationsTable.companyType);

    console.log("Applications fetched:", allApplications.length); // Debug log
    console.log("Daily stats:", dailyStats.length); // Debug log

    return {
      applications: allApplications,
      dailyStats,
      statusStats,
      companyTypeStats,
    };
  } catch (error) {
    console.error("Error fetching applications with stats:", error);
    return {
      applications: [] as Application[],
      dailyStats: [] as { date: string; count: number }[],
      statusStats: [] as { status: string; count: number }[],
      companyTypeStats: [] as { companyType: string; count: number }[],
    };
  }
}

export async function getApplicationsByCategory(category: string): Promise<Application[]> {
  try {
    if (category === 'all') {
      return await db.select().from(applicationsTable).orderBy(desc(applicationsTable.appliedDate));
    }
    
    return await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.companyType, category as typeof companyTypeEnum.enumValues[number]))
      .orderBy(desc(applicationsTable.appliedDate));
  } catch (error) {
    console.error("Error fetching applications by category:", error);
    return [];
  }
}

export async function updateApplication(
  id: number, 
  data: Partial<Application>,
  reachoutMethods?: Array<{
    id?: number;
    applicationId: number;
    method: typeof ReachoutMethodEnum.enumValues[number];
    personContacted?: string;
    contactInfo?: string;
  }>
) {
  try {
    // Update application data
    await db
      .update(applicationsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(applicationsTable.id, id));

    // Handle reach-out methods if provided
    if (reachoutMethods) {
      // Delete existing reach-out methods for this application
      await db.delete(reachout_methods).where(eq(reachout_methods.applicationId, id));
      
      // Insert new reach-out methods
      const validMethods = reachoutMethods.filter(method => 
        method.method && (method.personContacted || method.contactInfo)
      );
      
      if (validMethods.length > 0) {
        await db.insert(reachout_methods).values(
          validMethods.map(method => ({
            applicationId: id,
            method: method.method,
            personContacted: method.personContacted || null,
            contactInfo: method.contactInfo || null,
          }))
        );
      }
    }
    
    // Revalidate all affected paths
    revalidatePath("/dashboard");
    revalidatePath("/category-wise/all");
    if (data.companyType) {
      revalidatePath(`/category-wise/${data.companyType}`);
    }
    revalidatePath("/category-wise/[category]", "page");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating application:", error);
    return { success: false, error: "Failed to update application" };
  }
}

export async function createQuickApplication(formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const position = formData.get("position") as string;
  const companyType = formData.get("companyType") as typeof companyTypeEnum.enumValues[number];

  try {
    await db.insert(applicationsTable).values({
      companyName,
      position,
      companyType,
      status: "APPLIED",
    });

    // Revalidate all affected paths
    revalidatePath("/dashboard");
    revalidatePath("/category-wise/all");
    revalidatePath(`/category-wise/${companyType}`);
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create application" };
  }
}

// Additional helper function to force refresh dashboard
export async function refreshDashboard() {
  try {
    revalidatePath("/dashboard");
    revalidatePath("/category-wise/all");
    revalidatePath("/category-wise/[category]", "page");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to refresh dashboard" };
  }
}

// Function to get fresh stats without cache
export async function getFreshApplicationStats() {
  const allApplications: Application[] = await db
    .select()
    .from(applicationsTable)
    .orderBy(desc(applicationsTable.appliedDate));

  const totalApplications = allApplications.length;
  const todayApplications = allApplications.filter(
    (app: Application) => new Date(app.appliedDate).toDateString() === new Date().toDateString()
  ).length;

  const proceededCount = allApplications.filter((app: Application) => app.status === "PROCEEDED").length;
  const successRate = totalApplications ? Math.round((proceededCount / totalApplications) * 100) : 0;
  
  const rejectedCount = allApplications.filter((app: Application) => app.status === "REJECTED").length;

  return {
    totalApplications,
    todayApplications,
    successRate,
    rejectedCount,
    proceededCount
  };
}
