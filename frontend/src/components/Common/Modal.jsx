// frontend/src/components/Common/Modal.jsx
import React from 'react';
import { Modal as UIModal } from '../UI/Modal';

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth }) => {
  let size = 'small';
  if (maxWidth === 'max-w-2xl' || maxWidth === 'max-w-3xl') size = 'medium';
  if (maxWidth === 'max-w-4xl' || maxWidth === 'max-w-5xl') size = 'large';

  return (
    <UIModal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size={size}>
      {children}
    </UIModal>
  );
};

export default Modal;

