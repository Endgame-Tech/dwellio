import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-white">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/admin"
          className="admin-btn-primary inline-flex items-center"
        >
          <FiHome className="w-4 h-4 mr-2" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}