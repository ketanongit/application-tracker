"use client";

import { createDailyTarget } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function DailyTargetForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const date = formData.get("date") as string;
    const count = parseInt(formData.get("count") as string);
    
    await createDailyTarget(date, count);
    setIsLoading(false);
    
    // Reset form
    (document.getElementById('daily-target-form') as HTMLFormElement)?.reset();
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Set Daily Target</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="daily-target-form" action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="count">Number of Applications</Label>
            <Input
              id="count"
              name="count"
              type="number"
              min="1"
              max="50"
              required
              placeholder="e.g., 5"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Target"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
