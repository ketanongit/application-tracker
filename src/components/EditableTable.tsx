"use client";
import { useState } from "react";
import { Application } from "@/db/schema";
import { updateApplication } from "@/app/actions/application";
import { Button } from "@/components/ui/button";

interface ReachoutMethod {
  id?: number;
  applicationId: number;
  method: "LINKEDIN_INMAIL" | "EMAIL" | "OTHER";
  personContacted?: string;
  contactInfo?: string;
}

interface ApplicationWithReachout extends Application {
  reachoutMethods?: ReachoutMethod[];
}

interface EditableTableProps {
  applications: ApplicationWithReachout[];
}

export default function EditableTable({ applications }: EditableTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ApplicationWithReachout>>({});
  const [reachoutMethods, setReachoutMethods] = useState<ReachoutMethod[]>([]);

  const handleEdit = (application: ApplicationWithReachout) => {
    setEditingId(application.id);
    setEditData(application);
    setReachoutMethods(application.reachoutMethods || []);
  };

  const addReachoutMethod = () => {
    const newMethod: ReachoutMethod = {
      applicationId: editingId!,
      method: "EMAIL",
      personContacted: "",
      contactInfo: "",
    };
    setReachoutMethods([...reachoutMethods, newMethod]);
  };

  const updateReachoutMethod = (index: number, field: keyof ReachoutMethod, value: string) => {
    const updated = [...reachoutMethods];
    updated[index] = { ...updated[index], [field]: value };
    setReachoutMethods(updated);
  };

  const removeReachoutMethod = (index: number) => {
    setReachoutMethods(reachoutMethods.filter((_, i) => i !== index));
  };

  const handleSave = async (id: number) => {
    await updateApplication(id, editData, reachoutMethods);
    setEditingId(null);
    setEditData({});
    setReachoutMethods([]);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setReachoutMethods([]);
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
            <th className="border border-gray-300 p-2 text-left">Reach Out</th>
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
                    <option value="WELL_FUNDED_STARTUP">Well funded Startup</option>
                    <option value="EARLY_STAGE_STARTUP">Early Stage Startup</option>
                    <option value="PUBLIC_COMPANY">Public Company</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  app.companyType.replace(/_/g, ' ')
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
                    <option value="REJECTED">Rejected</option>
                    <option value="PROCEEDED">Proceeded</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    app.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {app.status}
                  </span>
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingId === app.id ? (
                  <div className="space-y-2">
                    {reachoutMethods.map((method, index) => (
                      <div key={index} className="space-y-2 p-2 border rounded bg-gray-50">
                        <div className="flex gap-2">
                          <select
                            value={method.method}
                            onChange={(e) => updateReachoutMethod(index, 'method', e.target.value)}
                            className="flex-1 p-1 border rounded text-xs"
                          >
                            <option value="EMAIL">Email</option>
                            <option value="LINKEDIN_INMAIL">LinkedIn InMail</option>
                            <option value="OTHER">Other</option>
                          </select>
                          <button
                            onClick={() => removeReachoutMethod(index)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                          >
                            ×
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Person contacted"
                          value={method.personContacted || ''}
                          onChange={(e) => updateReachoutMethod(index, 'personContacted', e.target.value)}
                          className="w-full p-1 border rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Contact info"
                          value={method.contactInfo || ''}
                          onChange={(e) => updateReachoutMethod(index, 'contactInfo', e.target.value)}
                          className="w-full p-1 border rounded text-xs"
                        />
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={addReachoutMethod}>
                      Add Reach Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {app.reachoutMethods?.map((method, index) => (
                      <div key={index} className="text-xs">
                        <span className="font-medium">{method.method.replace('_', ' ')}</span>
                        {method.personContacted && (
                          <div className="text-gray-600">{method.personContacted}</div>
                        )}
                      </div>
                    )) || <span className="text-gray-400 text-xs">None</span>}
                  </div>
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
