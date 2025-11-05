import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main profile page
    navigate('/profile', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-ubani-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ubani-yellow mx-auto mb-4"></div>
        <p className="text-white">Redirecting to your profile...</p>
      </div>
    </div>
  );
}