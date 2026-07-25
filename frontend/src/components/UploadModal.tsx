import React from 'react';
import { AddExpenseModal } from './AddExpenseModal';
import { Category } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onExpenseCreated: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = (props) => {
  return <AddExpenseModal {...props} initialTab="scan" />;
};

export { AddExpenseModal };
