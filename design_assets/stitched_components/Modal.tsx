import React from 'react';

type ModalProps = {
  title?: string;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ title, open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-sm text-headline-sm">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-on-surface">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
