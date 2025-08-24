import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

export default function ApplicationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Add New Application</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard">
            <Button variant="outline">← Dashboard</Button>
          </Link>
          <Link href="/quick-addition">
            <Button variant="outline">Quick Add</Button>
          </Link>
          <LogoutButton />
        </div>
      </div>

      <ApplicationForm />
    </div>
  );
}
