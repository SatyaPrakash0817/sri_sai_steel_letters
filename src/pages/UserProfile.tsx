import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            logout();
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-400 text-center">
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-gray-400">User data not found</div>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-20">
      <div className="bg-white/5 p-8 rounded-lg border border-white/6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-white font-bold">My Profile</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your account information</p>
          </div>
          <User size={40} className="text-indigo-400" />
        </div>

        {/* Profile Information */}
        <div className="space-y-6 mb-8">
          {/* Name */}
          <div className="bg-black/30 p-4 rounded-lg border border-white/6">
            <label className="text-gray-400 text-sm block mb-2">Full Name</label>
            <div className="flex items-center gap-3">
              <User size={20} className="text-indigo-400" />
              <p className="text-white text-lg">{user.name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-black/30 p-4 rounded-lg border border-white/6">
            <label className="text-gray-400 text-sm block mb-2">Email Address</label>
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-indigo-400" />
              <p className="text-white text-lg">{user.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-black/30 p-4 rounded-lg border border-white/6">
            <label className="text-gray-400 text-sm block mb-2">Phone Number</label>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-indigo-400" />
              <p className="text-white text-lg">{user.phone || 'Not provided'}</p>
            </div>
          </div>

          {/* Member Since */}
          <div className="bg-black/30 p-4 rounded-lg border border-white/6">
            <label className="text-gray-400 text-sm block mb-2">Member Since</label>
            <p className="text-white text-lg">
              {new Date(user.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition font-medium"
          >
            <Settings size={18} />
            Settings
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}
