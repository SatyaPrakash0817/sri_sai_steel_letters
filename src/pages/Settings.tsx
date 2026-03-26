import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../utils/api';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
}

type SettingTab = 'editProfile' | 'changePassword';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingTab>('editProfile');
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token, logout } = useAuth();
  
  // Edit Profile states
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Change Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(buildApiUrl('/api/profile'), {
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
        setProfileName(data.user.name);
        setProfilePhone(data.user.phone);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate, logout]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!profileName || !profilePhone) {
      setError('Name and phone are required');
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    setProfileLoading(true);
    try {
      const res = await fetch(buildApiUrl('/api/profile/update'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: profileName, phone: profilePhone })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser(data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch(buildApiUrl('/api/password/change'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password changed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading...</div>
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 hover:bg-white/5 rounded transition"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-3xl text-white font-bold">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/6">
        <button
          onClick={() => {
            setActiveTab('editProfile');
            setError(null);
            setSuccess(null);
          }}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'editProfile'
              ? 'text-white border-indigo-500'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Edit Profile
        </button>
        <button
          onClick={() => {
            setActiveTab('changePassword');
            setError(null);
            setSuccess(null);
          }}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'changePassword'
              ? 'text-white border-indigo-500'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Edit Profile Tab */}
      {activeTab === 'editProfile' && (
        <div className="bg-white/5 p-8 rounded-lg border border-white/6">
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full p-3 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10 digit mobile number"
                maxLength={10}
                className="w-full p-3 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full p-3 rounded bg-black/30 border border-white/6 text-gray-500 cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={profileLoading}
              className={`w-full mt-6 p-3 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition ${
                profileLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {profileLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'changePassword' && (
        <div className="bg-white/5 p-8 rounded-lg border border-white/6">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 focus:border-indigo-500 transition"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 focus:border-indigo-500 transition"
                  placeholder="Enter new password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded bg-black/30 border border-white/6 text-white placeholder-gray-500 focus:border-indigo-500 transition"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={passwordLoading}
              className={`w-full mt-6 p-3 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition ${
                passwordLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {passwordLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
