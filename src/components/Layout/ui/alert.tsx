import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import type { AlertProps } from '../../../types/ui.types';

export const Alert: React.FC<AlertProps> = ({ 
  type = 'error', 
  message, 
  className = '' 
}) => {
  const types = {
    error: {
      classes: 'bg-red-50 border-red-200 text-red-800',
      icon: <AlertCircle className="w-5 h-5" />
    },
    success: {
      classes: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle className="w-5 h-5" />
    },
    warning: {
      classes: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    info: {
      classes: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info className="w-5 h-5" />
    }
  };

  const { classes, icon } = types[type];

  return (
    <div className={`flex items-center space-x-3 p-4 rounded-xl border ${classes} ${className}`}>
      {icon}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};