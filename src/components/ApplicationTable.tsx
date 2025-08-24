"use client";

import { Application } from "@/db/schema";
import { updateApplicationStatus } from "@/app/actions/application";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ApplicationsTableProps {
  applications: Application[];
}

export default function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function handleStatusUpdate(
    applicationId: number,
    status: string,
    currentRound?: string,
    finalVerdict?: string
  ) {
    setLoadingId(applicationId);
    await updateApplicationStatus(applicationId, status, currentRound, finalVerdict);
    setLoadingId(null);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPLIED": return "bg-blue-100 text-blue-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      case "PROCEEDED": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((app) => (
            <ApplicationRow
              key={app.id}
              application={app}
              onStatusUpdate={handleStatusUpdate}
              isLoading={loadingId === app.id}
              getStatusColor={getStatusColor}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApplicationRow({ application, onStatusUpdate, isLoading, getStatusColor }: any) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentRound, setCurrentRound] = useState(application.currentRound || "");
  const [finalVerdict, setFinalVerdict] = useState(application.finalVerdict || "");

  return (
    <>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{application.companyName}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{application.position}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{application.companyType.replace('_', ' ')}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <Badge className={getStatusColor(application.status)}>
            {application.status}
          </Badge>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(application.appliedDate).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide" : "Details"}
          </Button>
        </td>
      </tr>
      
      {showDetails && (
        <tr>
          <td colSpan={6} className="px-6 py-4 bg-gray-50">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <Select
                    defaultValue={application.status}
                    onValueChange={(value) => onStatusUpdate(application.id, value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPLIED">Applied</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="PROCEEDED">Proceeded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {application.status === "PROCEEDED" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Round</label>
                    <Input
                      value={currentRound}
                      onChange={(e) => setCurrentRound(e.target.value)}
                      placeholder="e.g., Technical Round 2"
                      onBlur={() => onStatusUpdate(application.id, "PROCEEDED", currentRound, finalVerdict)}
                    />
                  </div>
                )}
              </div>
              
              {application.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-600">{application.notes}</p>
                </div>
              )}
              
              {application.applicationUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Application URL</label>
                  <a
                    href={application.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {application.applicationUrl}
                  </a>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
