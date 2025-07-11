import React from 'react';
import { User } from '../../types';

interface InstructorItemProps {
  instructor: User;
  onRemove: (id: string) => void;
  isRemoving: boolean;
  highlight: boolean;
}

const InstructorItem: React.FC<InstructorItemProps> = ({
  instructor,
  onRemove,
  isRemoving,
  highlight,
}) => {
  return (
    <li
      key={instructor.id}
      className={`p-4 rounded flex justify-between items-center transition-colors duration-300 ${
        highlight ? 'bg-red-700/80 line-through' : 'bg-gray-800'
      }`}
    >
      <div>
        <p className="font-semibold">{instructor.name}</p>
        <p className="text-sm text-gray-400">{instructor.email}</p>
      </div>
      <button
        onClick={() => onRemove(instructor.id)}
        disabled={isRemoving}
        className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 transition disabled:opacity-50"
      >
        Remover
      </button>
    </li>
  );
};

export default InstructorItem;
