// frontend/src/components/Common/LoadingSpinner.jsx
import React from 'react';
import { Spinner } from '../UI/Spinner';

export const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  return <Spinner size={size} label={message} className="p-6" />;
};

export default LoadingSpinner;

