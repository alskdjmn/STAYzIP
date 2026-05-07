/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';

export const RiskBadge: React.FC<{ level?: RiskLevel }> = ({ level }) => {
  if (!level) return null;

  const config = {
    '안전': { color: 'bg-green-100 text-green-700 border-green-200', icon: ShieldCheck },
    '주의': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertTriangle },
    '위험': { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  };

  const { color, icon: Icon } = config[level];

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
      <Icon size={16} className="mr-1.5" />
      {level}
    </div>
  );
};

export const SectionTitle: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center mb-3 mt-6 first:mt-0">
    {icon && <span className="mr-2 text-blue-600">{icon}</span>}
    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className}`}>
    {children}
  </div>
);
