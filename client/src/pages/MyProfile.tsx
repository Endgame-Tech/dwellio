import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main profile page
    navigate('/profile', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to your profile...</p>
      </div>
    </div>
  );
}