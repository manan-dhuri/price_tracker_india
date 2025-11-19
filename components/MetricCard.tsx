import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subValue, trend, highlight }) => {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'} shadow-sm`}>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-blue-700' : 'text-slate-800'}`}>
        {typeof value === 'number' ? 
          new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value) 
          : value}
      </p>
      {subValue && (
        <p className={`text-xs mt-1 ${trend === 'down' ? 'text-green-600' : trend === 'up' ? 'text-red-500' : 'text-slate-400'}`}>
          {subValue}
        </p>
      )}
    </div>
  );
};
