import React from 'react';

/**
 * Reusable Status Badge Component
 * @param {Object} props
 * @param {'success'|'warning'|'danger'|'info'|'neutral'|string} props.status
 * @param {string} [props.label]
 */
export default function StatusBadge({ status, label, className = '' }) {
  const currentStatus = status?.toLowerCase();

  const statusMap = {
    // Standard themes
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-gray-50 text-gray-700 border-gray-200',
    
    // Domain synonyms
    active: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    progress: 'bg-blue-50 text-blue-700 border-blue-200',
    inactive: 'bg-gray-50 text-gray-700 border-gray-200',
    closed: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const styleClass = statusMap[currentStatus] || statusMap.neutral;
  const badgeLabel = label || status?.charAt(0).toUpperCase() + status?.slice(1);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass} ${className}`}
    >
      {badgeLabel}
    </span>
  );
}
