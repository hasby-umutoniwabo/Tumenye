'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BookOpen, Users, Globe, Award, ArrowRight } from 'lucide-react';
import ModuleCard from '@/components/ModuleCard';
import { modules } from '@/data/modules';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tumenye-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tumenye-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-tumenye-light-blue">Tumenye</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-slide-up">
              Empowering Rwandan Youth Through Digital Literacy
            </p>
            <p className="text-lg mb-12 text-blue-200 max-w-2xl mx-auto">
              Master essential digital skills including Microsoft Word, Excel, Email Communication, 
              and Online Safety through our interactive learning platform designed specifically 
              for the digital future of Rwanda.
            </p>
            
            {!session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/auth/signup"
                  className="bg-white text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center shadow-md border-2 border-white"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/auth/signin"
                  className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-black hover:shadow-lg transition-all duration-200 shadow-md"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {session.user.role === 'admin' ? (
                  <>
                    <Link 
                      href="/admin"
                      className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                    >
                      Admin Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link 
                      href="/admin/users"
                      className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-colors"
                    >
                      Manage Users
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/modules"
                      className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                    >
                      Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link 
                      href="/dashboard"
                      className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-colors"
                    >
                      View Progress
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in the power of technology to transform lives. Our mission is to bridge 
              the digital divide and prepare Rwanda's youth for a technology-driven future through 
              accessible, high-quality digital literacy education.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-tumenye-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Quality Education</h3>
              <p className="text-gray-600">
                Interactive lessons designed by education experts to ensure effective learning outcomes.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-tumenye-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-tumenye-blue text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Community Focus</h3>
              <p className="text-gray-600">
                Built specifically for Rwandan youth, considering local context and needs.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-tumenye-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Tech for Good</h3>
              <p className="text-gray-600">
                Using technology as a force for positive social change and economic empowerment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Modules Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master essential digital skills through our comprehensive learning modules
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                isClickable={false}
              />
            ))}
          </div>

          {session && (
            <div className="text-center mt-12">
              <Link 
                href="/modules"
                className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-tumenye-blue text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Award className="h-16 w-16 mx-auto mb-6 text-tumenye-light-blue" />
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Digital Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of Rwandan youth who are already building their digital skills for a better future.
          </p>
          
          {!session ? (
            <Link 
              href="/auth/signup"
              className="bg-white text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 hover:shadow-lg transition-all duration-200 inline-flex items-center shadow-md border-2 border-white"
            >
              Create Your Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link 
              href="/dashboard"
              className="bg-white text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 hover:shadow-lg transition-all duration-200 inline-flex items-center shadow-md border-2 border-white"
            >
              Check Your Progress
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
