import React from 'react';
import { AuthPortal } from './AuthPortal';
import type { StudentProfile } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: StudentProfile) => void;
  existingStudents: StudentProfile[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  existingStudents,
}) => {
  if (!isOpen) return null;

  return (
    <AuthPortal
      onLoginSuccess={onLoginSuccess}
      existingStudents={existingStudents}
      onClose={onClose}
      canClose={existingStudents.length > 0}
    />
  );
};
