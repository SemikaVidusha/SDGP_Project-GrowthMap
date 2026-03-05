import React from 'react';
import { motion } from 'framer-motion';

const LKR = (val) => `Rs. ${val.toLocaleString()}`;

export default function PathwayCostBar({ traditional, alternatives }) {
  const maxCost = traditional.cost;

  const allPaths = [
    { label: traditional.label, cost: traditional.cost, color: 'bg-blue-400', textColor: 'text-blue-700', bg: 'bg-blue-50' },
    ...alternatives.map((a, i) => {
      const colors = [
        { color: 'bg-green-400', textColor: 'text-green-700', bg: 'bg-green-50' },
        { color: 'bg-purple-400', textColor: 'text-purple-700', bg: 'bg-purple-50' },
        { color: 'bg-orange-400', textColor: 'text-orange-700', bg: 'bg-orange-50' },
        { color: 'bg-teal-400', textColor: 'text-teal-700', bg: 'bg-teal-50' },
      ];
      return { label: a.label, cost: a.cost, ...colors[i % colors.length] };
    }),
  ];

  return (
    <div className="space-y-3">
      {allPaths.map((p, i) => {
        const pct = Math.max(4, (p.cost / maxCost) * 100);
        const savings = maxCost - p.cost;
        return (
          <div key={i} className={`rounded-xl p-3 ${p.bg}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-sm font-semibold ${p.textColor}`}>{p.label}</span>
              <div className="text-right">
                <span className={`text-sm font-bold ${p.textColor}`}>{LKR(p.cost)}</span>
                {savings > 0 && (
                  <span className="text-xs text-slate-500 ml-2">save {LKR(savings)}</span>
                )}
              </div>
            </div>
            <div className="h-3 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${p.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}