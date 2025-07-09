import React from 'react';

interface CourseFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const CourseFilter: React.FC<CourseFilterProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Buscar por nome do curso"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-white text-black px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/2"
      />
    </div>
  );
};

export default CourseFilter;
