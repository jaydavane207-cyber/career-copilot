// frontend/src/components/Common/Toast.jsx
import React from 'react';
import { Toast as UIToast } from '../UI/Toast';

export const Toast = ({ toast, onClose }) => {
  return <UIToast toast={toast} onClose={onClose} />;
};

export default Toast;

