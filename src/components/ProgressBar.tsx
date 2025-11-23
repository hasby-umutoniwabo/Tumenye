import { CheckCircle, Circle, Clock } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
  title: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  completed, 
  total, 
  title, 
  showPercentage = true 
}: ProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {showPercentage && (
          <span className="text-sm font-medium text-tumenye-blue">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div 
          className="bg-gradient-to-r from-tumenye-blue to-blue-500 h-3 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-black font-bold">{completed} completed</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Circle className="h-4 w-4 text-gray-400" />
            <span className="text-black font-bold">{total - completed} remaining</span>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-black font-black text-base">{completed} of {total} lessons</span>
        </div>
      </div>
    </div>
  );
}
