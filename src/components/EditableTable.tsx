"use client";

import { useState } from "react";
import { Application } from "@/db/schema";
import { updateApplication } from "@/app/actions/application";
import { Button } from "@/components/ui/button";

interface EditableTableProps {
  applications: Application[];
}

export default function EditableTable({ applications }: EditableTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Application>>({});

  const handleEdit = (application: Application) => {
    setEditingId(application.id);
    setEditData(application);
  };

  const handleSave = async (id: number) => {
    await updateApplication(id, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 p-2 text-left">Company</th>
            <th className="border border-gray-300 p-2 text-left">Position</th>
            <th className="border border-gray-300 p-2 text-left">Type</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-left">Date</th>
            <th className="border border-gray-300 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">
                {editingId === app.id ? (
                  <input
                    type="text"
                    value={editData.companyName || ''}
                    onChange={(e) => setEditData({...editData, companyName: e.target.value})}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  app.companyName
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingId === app.id ? (
                  <input
                    type="text"
                    value={editData.position || ''}
                    onChange={(e) => setEditData({...editData, position: e.target.value})}
                    className="w-full p-1 border rounded"
                  />
                ) : (
                  app.position
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingId === app.id ? (
                  <select
                    value={editData.companyType || ''}
                    onChange={(e) => setEditData({...editData, companyType: e.target.value as any})}
                    className="w-full p-1 border rounded"
                  >
                    <option value="MNC">MNC</option>
                    <option value="YC_STARTUP">YC Startup</option>
                    <option value="INDIAN_UNICORN">Indian Unicorn</option>
                    <option value="WELLFOUND_STARTUP">Wellfound Startup</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  app.companyType.replace('_', ' ')
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingId === app.id ? (
                  <select
                    value={editData.status || ''}
                    onChange={(e) => setEditData({...editData, status: e.target.value as any})}
                    className="w-full p-1 border rounded"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="PROCEEDED">Proceeded</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    app.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {app.status}
                  </span>
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {new Date(app.appliedDate).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2">
                {editingId === app.id ? (
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => handleSave(app.id)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleEdit(app)}>
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
