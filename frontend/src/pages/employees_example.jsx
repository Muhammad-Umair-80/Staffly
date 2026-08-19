import React from 'react';

const sampleData = [
  { id: 1, name: 'Alice Johnson', role: 'Frontend Developer', status: 'Active' },
  { id: 2, name: 'Bob Smith', role: 'Product Designer', status: 'On Leave' },
  { id: 3, name: 'Carlos Reyes', role: 'Backend Developer', status: 'Active' }
];

export default function EmployeesExample() {
  return (
    <div className="min-h-screen bg-background text-on-surface p-container-padding">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Employees</h2>
            <p className="text-body-sm text-on-surface-variant">Manage your organization’s users</p>
          </div>
          <div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-on-primary font-semibold">Add Employee</button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <table className="min-w-full w-full table-auto">
            <thead className="bg-surface-container p-2">
              <tr>
                <th className="text-left p-4 text-label-md text-on-surface-variant">Name</th>
                <th className="text-left p-4 text-label-md text-on-surface-variant">Role</th>
                <th className="text-left p-4 text-label-md text-on-surface-variant">Status</th>
                <th className="text-left p-4 text-label-md text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="p-4">{row.name}</td>
                  <td className="p-4">{row.role}</td>
                  <td className="p-4">{row.status}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded bg-secondary text-on-secondary">Edit</button>
                      <button className="px-3 py-1 rounded bg-transparent text-on-surface border border-outline-variant">Profile</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
