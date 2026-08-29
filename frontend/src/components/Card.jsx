import React from 'react';

/**
 * Reusable Card Component
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} [props.footer]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export default function Card({
  title,
  subtitle,
  children,
  footer,
  className = '',
  ...props
}) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-base font-semibold text-gray-900 leading-6">{title}</h3>}
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className="px-6 py-5">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 bg-gray-55 border-t border-gray-200 bg-gray-50/50 flex justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}
