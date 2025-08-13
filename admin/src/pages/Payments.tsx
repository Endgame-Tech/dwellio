import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

export default function Payments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <FiDollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Track payments, generate reports, and manage transactions</p>
        </div>
      </div>
      
      <div className="admin-card p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Management</h3>
        <p className="text-gray-600">Payment management interface will be implemented here.</p>
      </div>
    </div>
  );
}