import { FileText, Sheet, Mail, Shield, Presentation, LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  FileText,
  Sheet,
  Mail,
  Shield,
  Presentation,
};

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress?: number;
  totalLessons?: number;
  onClick?: () => void;
  isClickable?: boolean;
}

export default function ModuleCard({ 
  title, 
  description, 
  icon, 
  progress = 0, 
  totalLessons = 0,
  onClick,
  isClickable = true
}: ModuleCardProps) {
  const IconComponent = iconMap[icon] || FileText;
  const completionPercentage = totalLessons > 0 ? (progress / totalLessons) * 100 : 0;

  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 transition-all duration-200 ${
        isClickable 
          ? 'hover:shadow-md hover:scale-105 cursor-pointer hover:border-tumenye-blue' 
          : ''
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-tumenye-light-blue rounded-lg flex items-center justify-center">
            <IconComponent className="h-6 w-6 text-tumenye-blue" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>
          
          {totalLessons > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="text-tumenye-blue font-medium">
                  {progress}/{totalLessons} lessons
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-tumenye-blue to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{Math.round(completionPercentage)}% complete</span>
                {completionPercentage === 100 && (
                  <span className="text-green-600 font-medium">✓ Completed</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isClickable && (
        <div className="mt-6 flex justify-center">
          <button className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>Start Learning</span>
              <span>→</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
