import React from 'react';
import { Save, XCircle, Trash2 } from 'lucide-react';

interface LessonFormProps {
  title: string;
  setTitle: (title: string) => void;
  status: 'published' | 'draft' | 'archived'; // Corrigido: Agora inclui 'archived'
  setStatus: (status: 'published' | 'draft' | 'archived') => void; // Corrigido: Agora inclui 'archived'
  publishDate: string;
  setPublishDate: (date: string) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;

  isEditing: boolean;
  isProcessing: boolean;
  canDelete: boolean;

  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onDelete: () => void;

  courseName?: string;
  lessonTitle?: string;
}

const LessonForm: React.FC<LessonFormProps> = ({
  title,
  setTitle,
  status,
  setStatus,
  publishDate,
  setPublishDate,
  videoUrl,
  setVideoUrl,
  isEditing,
  isProcessing,
  canDelete,
  onSubmit,
  onCancel,
  onDelete,
  courseName,
  lessonTitle,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white font-sans">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold text-indigo-400 mb-10 text-center tracking-wide drop-shadow-lg">
          {isEditing
            ? `Editar Aula: "${lessonTitle || 'Carregando...'}"`
            : `Criar Nova Aula para "${courseName || 'Carregando...'}"`}
        </h1>

        <form
          onSubmit={onSubmit}
          className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Título da Aula:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
              placeholder="Ex: Introdução à Programação"
              required
              minLength={3}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'published' | 'draft' | 'archived')
              } // Corrigido: Agora inclui 'archived'
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg appearance-none"
              required
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>{' '}
              {/* Adicionada opção */}
            </select>
          </div>

          <div>
            <label
              htmlFor="publish_date"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Data de Publicação:
            </label>
            <input
              type="date"
              id="publish_date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
              required
            />
          </div>

          <div>
            <label
              htmlFor="video_url"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              URL do Vídeo:
            </label>
            <input
              type="url"
              id="video_url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
              placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              required
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-full hover:bg-green-500 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />{' '}
              {isProcessing
                ? isEditing
                  ? 'Salvando...'
                  : 'Criando...'
                : isEditing
                  ? 'Salvar Alterações'
                  : 'Criar Aula'}
            </button>

            {canDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-rose-700 rounded-full hover:bg-rose-600 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={20} /> Excluir Aula
              </button>
            )}

            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle size={20} /> Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default LessonForm;
