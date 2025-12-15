import React from 'react';
import { Metric } from '../../types';

const MetricOrb: React.FC<{ metric: Metric; delay: number }> = ({ metric }) => {
  return (
    <div className="flex flex-col p-5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors duration-300 shadow-sm shadow-gray-100/50">
      <span className="text-gray-500 text-[11px] uppercase tracking-wider font-medium mb-3">
        {metric.label}
      </span>
      <div className="flex items-baseline gap-3">
        <h3 className="text-2xl font-light text-black tracking-tight">
          {metric.value}
        </h3>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
          metric.trendUp 
            ? 'text-black border-gray-200 bg-gray-50' 
            : 'text-gray-500 border-gray-200 bg-gray-50'
        }`}>
          {metric.trendUp ? '+' : ''}{metric.trend}%
        </span>
      </div>
    </div>
  );
};

export default MetricOrb;