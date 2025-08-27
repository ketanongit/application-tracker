"use client";

import { createApplication } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function ApplicationForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const result = await createApplication(formData);
    setIsLoading(false);
    
    if (result.success) {
      // Reset form
      (document.getElementById('application-form') as HTMLFormElement)?.reset();
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Job Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="application-form" action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              required
              placeholder="e.g., Google, Microsoft, Razorpay"
            />
          </div>

          <div>
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              name="position"
              required
              placeholder="e.g., Software Engineer, Product Manager"
            />
          </div>

          <div>
            <Label htmlFor="companyType">Company Type *</Label>
            <Select name="companyType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MNC">MNC</SelectItem>
                <SelectItem value="YC_STARTUP">YC Startup</SelectItem>
                <SelectItem value="INDIAN_UNICORN">Indian Unicorn</SelectItem>
                <SelectItem value="WELL_FUNDED_STARTUP">Well funded Startup</SelectItem>
                <SelectItem value="EARLY_STAGE_STARTUP">Early Stage Startup</SelectItem>
                <SelectItem value="PUBLIC_COMPANY">Public Company</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="applicationUrl">Application URL</Label>
            <Input
              id="applicationUrl"
              name="applicationUrl"
              type="url"
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              placeholder="Brief description of the role..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Adding..." : "Add Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
