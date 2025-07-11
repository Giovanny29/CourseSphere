import React from 'react';
import { User } from '../../types';
import InstructorItem from './InstructorItem';

interface InstructorListProps {
  instructors: User[];
  onRemove: (id: string) => void;
  isProcessing: boolean;
  removingId: string | null;
}

const InstructorList: React.FC<InstructorListProps> = ({
  instructors,
  onRemove,
  isProcessing,
  removingId,
}) => {
  return (
    <ul className="space-y-4">
      {instructors.map((inst) => (
        <InstructorItem
          key={inst.id}
          instructor={inst}
          onRemove={onRemove}
          isRemoving={isProcessing}
          highlight={removingId === inst.id}
        />
      ))}
    </ul>
  );
};

export default InstructorList;
