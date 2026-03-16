import React from 'react';
import './ProgressBar.css';

export interface ProgressBarProps {
  progress?: number;
  showLabel?: boolean;
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  showLabel = false,
  height = 4,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const progressBarClasses = [
    'progress-bar',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={progressBarClasses} style={{ height: `${height}px` }}>
      <div
        className="progress-bar-fill"
        style={{
          width: `${clampedProgress}%`,
          height: `${height}px`,
        }}
      />
      {showLabel && (
        <span className="progress-bar-label">{Math.round(clampedProgress)}%</span>
      )}
    </div>
  );
};

export interface ProgressSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export const ProgressSpinner: React.FC<ProgressSpinnerProps> = ({
  size = 40,
  color = '#242EDB',
  className = '',
}) => {
  const spinnerClasses = ['progress-spinner', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={spinnerClasses}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderTopColor: color,
      }}
    />
  );
};
