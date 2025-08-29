"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createQuickApplication } from "@/app/actions/application";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function QuickAdditionPage() {
  const [isLoading, setIsLoading] = useState(false);
  async function handleQuickAdd(formData: FormData) {
    setIsLoading(true);
    await createQuickApplication(formData);
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quick Addition</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard">
            <Button variant="outline">← Dashboard</Button>
          </Link>
          <Link href="/application">
            <Button variant="outline">Full Form</Button>
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        {/* Quick Single Add */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Add</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleQuickAdd} className="space-y-4">
              <div>
                <Label htmlFor="quickCompany">Company Name</Label>
                <Input
                  id="quickCompany"
                  name="companyName"
                  placeholder="e.g., Google"
                  required
                />
              </div>
              <div>
                <Label htmlFor="quickPosition">Position</Label>
                <Input
                  id="quickPosition"
                  name="position"
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="quickCategory">Category</Label>
                <Select name="companyType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
              <Button type="submit" disabled={isLoading} className="w-full">
                Quick Add
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
