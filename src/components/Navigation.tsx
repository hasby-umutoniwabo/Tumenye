'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, User, LogOut, Home, BarChart3 } from 'lucide-react';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b border-tumenye-light-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="relative group">
              {/* Animated Background Layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-teal-500 rounded-xl opacity-20 animate-pulse group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-teal-400 via-blue-500 to-purple-600 rounded-xl opacity-15 animate-spin-slow group-hover:opacity-25 transition-opacity duration-500"></div>
              
              {/* Main Logo Container */}
              <div className="relative flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-teal-50 group-hover:from-blue-100 group-hover:via-purple-100 group-hover:to-teal-100 transition-all duration-300 transform group-hover:scale-105">
                {/* Icon Container */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-tumenye-blue via-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-3 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce opacity-80"></div>
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-teal-700 bg-clip-text text-transparent group-hover:from-blue-800 group-hover:via-purple-800 group-hover:to-teal-800 transition-all duration-300">
                    Tumenye
                  </span>
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-blue-700 font-medium animate-fade-in">Learn</span>
                    <span className="text-purple-600 font-medium animate-fade-in-delay-1">•</span>
                    <span className="text-teal-700 font-medium animate-fade-in-delay-2">Grow</span>
                    <span className="text-purple-600 font-medium animate-fade-in-delay-3">•</span>
                    <span className="text-blue-700 font-medium animate-fade-in-delay-4">Excel</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {session ? (
              <>
                <Link 
                  href="/"
                  className="flex items-center space-x-1 text-gray-700 hover:text-tumenye-blue transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                
                <Link 
                  href="/modules"
                  className="flex items-center space-x-1 text-gray-700 hover:text-tumenye-blue transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Modules</span>
                </Link>

                <Link 
                  href="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-tumenye-blue transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{session.user.name}</span>
                  </div>
                  
                  <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth/signin"
                  className="text-gray-700 hover:text-tumenye-blue font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-900 hover:shadow-lg transition-all duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
