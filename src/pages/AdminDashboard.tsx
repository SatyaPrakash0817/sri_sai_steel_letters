import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Mail, Calendar, Phone, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../utils/api';

interface Message {
  id: number;
  subject: string;
  message: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  messages: Message[];
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { token, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [token, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(buildApiUrl('/api/admin/users'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/admin/login');
          return;
        }
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserExpand = (userId: number) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Users className="text-blue-400" size={32} />
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Manage users and view all messages</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/20 transition font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block p-3 bg-blue-500/10 rounded-lg mb-4">
                <div className="w-8 h-8 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-400">Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-12 text-center">
            <Users size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">No users registered yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                {/* User Header */}
                <button
                  onClick={() => toggleUserExpand(user.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/20 transition"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Mail size={14} />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone size={14} />
                            {user.phone || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            {user.messages?.length || 0} messages
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400">
                    {expandedUsers.has(user.id) ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </div>
                </button>

                {/* User Info & Messages */}
                {expandedUsers.has(user.id) && (
                  <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700/50 space-y-4">
                    {/* User Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-700/50">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Full Name</p>
                        <p className="text-white font-medium mt-1">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                        <p className="text-blue-400 font-medium mt-1">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
                        <p className="text-white font-medium mt-1">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* Member Since */}
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={12} />
                        Member Since
                      </p>
                      <p className="text-slate-300 font-medium mt-1">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Messages Section */}
                    {user.messages && user.messages.length > 0 ? (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                          <MessageSquare size={12} />
                          Messages ({user.messages.length})
                        </p>
                        <div className="space-y-3">
                          {user.messages.map((msg) => (
                            <div key={msg.id} className="bg-slate-700/20 border border-slate-600/30 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-white">{msg.subject}</h4>
                                <span className="text-xs text-slate-400">
                                  {new Date(msg.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-slate-300 text-sm">{msg.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-700/20 border border-slate-600/30 rounded-lg p-4 text-center">
                        <MessageSquare size={24} className="mx-auto text-slate-500 mb-2" />
                        <p className="text-slate-400">No messages from this user</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Footer Stats */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-1">{users.length}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Total Messages</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">
                    {users.reduce((sum, user) => sum + (user.messages?.length || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Avg Messages Per User</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">
                    {users.length > 0 ? (users.reduce((sum, user) => sum + (user.messages?.length || 0), 0) / users.length).toFixed(1) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
