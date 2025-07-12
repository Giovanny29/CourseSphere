import React from 'react';

interface LessonFiltersProps {
  lessonSearch: string;
  setLessonSearch: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedInstructor: string;
  setSelectedInstructor: (val: string) => void;
  instructors: string[];
  getUserNameById: (id: string) => string;
}

const LessonFilters: React.FC<LessonFiltersProps> = ({
  lessonSearch,
  setLessonSearch,
  selectedStatus,
  setSelectedStatus,
  selectedInstructor,
  setSelectedInstructor,
  instructors,
  getUserNameById,
}) => {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <input
        type="text"
        placeholder="Buscar por título..."
        value={lessonSearch}
        onChange={(e) => setLessonSearch(e.target.value)}
        className="px-4 py-2 rounded bg-gray-700 text-white w-full"
      />

      <div className="flex gap-4 items-center text-sm text-gray-300">
        <label>
          <input
            type="radio"
            name="status"
            value=""
            checked={selectedStatus === ''}
            onChange={() => setSelectedStatus('')}
            className="mr-1"
          />
          Todos
        </label>
        <label>
          <input
            type="radio"
            name="status"
            value="draft"
            checked={selectedStatus === 'draft'}
            onChange={() => setSelectedStatus('draft')}
            className="mr-1"
          />
          Rascunho
        </label>
        <label>
          <input
            type="radio"
            name="status"
            value="published"
            checked={selectedStatus === 'published'}
            onChange={() => setSelectedStatus('published')}
            className="mr-1"
          />
          Publicada
        </label>
        <label>
          {' '}
          {/* NOVA OPÇÃO PARA 'ARCHIVED' */}
          <input
            type="radio"
            name="status"
            value="archived"
            checked={selectedStatus === 'archived'}
            onChange={() => setSelectedStatus('archived')}
            className="mr-1"
          />
          Arquivada
        </label>
      </div>

      <select
        value={selectedInstructor}
        onChange={(e) => setSelectedInstructor(e.target.value)}
        className="px-4 py-2 rounded bg-gray-700 text-white w-full"
      >
        <option value="">Todos os instrutores</option>
        {instructors.map((instrutorId) => (
          <option key={instrutorId} value={instrutorId}>
            {getUserNameById(instrutorId)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LessonFilters;
