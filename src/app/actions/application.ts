"use server";

import { db } from "@/db";
import { applications, dailyApplications } from "@/db/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createApplication(formData: FormData) {
  const companyName = formData.get("companyName") as string;
  const position = formData.get("position") as string;
  const companyType = formData.get("companyType") as any;
  const jobDescription = formData.get("jobDescription") as string;
  const applicationUrl = formData.get("applicationUrl") as string;
  const notes = formData.get("notes") as string;

  try {
    await db.insert(applications).values({
      companyName,
      position,
      companyType,
      jobDescription: jobDescription || null,
      applicationUrl: applicationUrl || null,
      notes: notes || null,
      status: "APPLIED",
    });

    revalidatePath("/dashboard");
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
      .update(applications)
      .set({
        status: status as any,
        currentRound,
        finalVerdict,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, applicationId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update application" };
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
    const placeholders = Array.from({ length: count }, (_, i) => ({
      companyName: `Placeholder ${i + 1}`,
      position: "To be filled",
      companyType: "OTHER" as any,
      appliedDate: targetDate,
      status: "APPLIED" as any,
      notes: "Created from daily target - please fill details",
    }));

    await db.insert(applications).values(placeholders);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create daily target" };
  }
}

export async function getApplicationsWithStats() {
  const allApplications = await db
    .select()
    .from(applications)
    .orderBy(desc(applications.appliedDate));

  // Get daily application counts for chart
  const dailyStats = await db
    .select({
      date: sql<string>`DATE(${applications.appliedDate})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(applications)
    .groupBy(sql`DATE(${applications.appliedDate})`)
    .orderBy(sql`DATE(${applications.appliedDate})`);

  // Get status distribution
  const statusStats = await db
    .select({
      status: applications.status,
      count: sql<number>`COUNT(*)`,
    })
    .from(applications)
    .groupBy(applications.status);

  // Get company type distribution
  const companyTypeStats = await db
    .select({
      companyType: applications.companyType,
      count: sql<number>`COUNT(*)`,
    })
    .from(applications)
    .groupBy(applications.companyType);

  return {
    applications: allApplications,
    dailyStats,
    statusStats,
    companyTypeStats,
  };
}
