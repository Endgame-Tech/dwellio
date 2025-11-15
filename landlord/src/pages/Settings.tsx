import React from 'react';
import { FiSettings } from 'react-icons/fi';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <FiSettings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system settings and preferences</p>
        </div>
      </div>

      <div className="landlord-card p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
        <p className="text-gray-600">System settings interface will be implemented here.</p>
      </div>
    </div>
  );
}