import { getApplicationsByCategory } from "@/app/actions/application";
import EditableTable from "@/components/EditableTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function CategoryPage({ 
  params 
}: { 
  params: { category: string } 
}) {
  const applications = await getApplicationsByCategory(params.category);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {params.category === 'all' ? 'All Applications' : 
             `${params.category.replace('_', ' ')} Applications`}
          </h1>
          <p className="text-gray-600">{applications.length} applications found</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/dashboard">
            <Button variant="outline">← Dashboard</Button>
          </Link>
          <LogoutButton />
        </div>
      </div>

      <EditableTable applications={applications} />
    </div>
  );
}
