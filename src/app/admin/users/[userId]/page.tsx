'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  ArrowLeft,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

interface UserProgress {
  totalLessons: number;
  completedLessons: number;
  currentStreak: number;
  totalGoals: number;
  completedGoals: number;
}

export default function UserDetailsPage({ params }: { params: Promise<{ userId: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (status === 'loading' || !userId) return;
    
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchUserDetails();
  }, [session, status, userId]);

  const fetchUserDetails = async () => {
    if (!userId) return;
    
    try {
      // Fetch user details
      const userResponse = await fetch(`/api/admin/users/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
      }

      // Fetch user progress (you'll need to create this endpoint)
      const progressResponse = await fetch(`/api/admin/users/${userId}/progress`);
      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setProgress(progressData);
      } else {
        // Set default progress if endpoint doesn't exist yet
        setProgress({
          totalLessons: 20,
          completedLessons: 5,
          currentStreak: 3,
          totalGoals: 10,
          completedGoals: 7
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tumenye-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-tumenye-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/users')}
                className="flex items-center space-x-2 text-gray-600 hover:text-tumenye-blue cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to All Users</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="h-6 w-6 text-tumenye-blue" />
              <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-tumenye-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                    {user.role === 'admin' ? 'Administrator' : 'Student'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-2">Last Login</div>
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2" />
                <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Statistics */}
        {progress && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Lessons Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Lessons</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {progress.completedLessons}/{progress.totalLessons}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.round((progress.completedLessons / progress.totalLessons) * 100)}% complete
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{progress.currentStreak}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    days in a row
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {progress.completedGoals}/{progress.totalGoals}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.round((progress.completedGoals / progress.totalGoals) * 100)}% achieved
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Achievement Score */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Achievement</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {Math.round(((progress.completedLessons / progress.totalLessons) + (progress.completedGoals / progress.totalGoals)) * 50)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    overall score
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Goal completed</p>
                <p className="text-xs text-gray-600">Completed daily learning goal - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Lesson completed</p>
                <p className="text-xs text-gray-600">Finished 'Email Basics' lesson - 1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Streak extended</p>
                <p className="text-xs text-gray-600">Learning streak now at 3 days - 2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
