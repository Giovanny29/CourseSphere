import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Course } from '../../types';
import { MESSAGES } from '../../constants/messages';
import { Save, XCircle } from 'lucide-react';

const CourseFormPage: React.FC = () => {
  const { id } = useParams(); // ID do curso a ser editado (será undefined para criação)
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId')!;
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userEmail = localStorage.getItem('userEmail') || 'Usuário';

  const [course, setCourse] = useState<Course | null>(null); // Armazena o curso se estiver editando
  const [isEditing, setIsEditing] = useState(false); // Novo estado para controlar o modo

  // Estados do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulação de carregamento

        if (id) {
          // Modo de Edição: Carrega dados do curso existente
          setIsEditing(true); // Define como modo de edição
          const resCourse = await fetch(`http://localhost:3001/courses/${id}`);
          if (!resCourse.ok) throw new Error(MESSAGES.ERRORS.COURSE_NOT_FOUND);
          const courseData: Course = await resCourse.json();
          setCourse(courseData);

          // Preencher formulário com dados do curso
          setName(courseData.name);
          setDescription(courseData.description || '');
          setStartDate(courseData.start_date);
          setEndDate(courseData.end_date);

          // Verificar permissões de edição: Apenas o criador do curso pode editar
          if (courseData.creator_id !== userId) {
            alert(
              'CourseSphere: Você não tem permissão para editar este curso.',
            );
            navigate(`/courses/${id}`); // Voltar para a página de detalhes do curso
            return;
          }
        } else {
          // Modo de Criação: Resetar estados para um novo formulário
          setIsEditing(false); // Define como modo de criação
          setName('');
          setDescription('');
          setStartDate('');
          setEndDate('');
          setCourse(null); // Garantir que não há curso pré-existente
        }
      } catch (error: unknown) {
        console.error('CourseSphere: Erro ao carregar dados do curso:', error);
        alert(
          `CourseSphere: Erro ao carregar dados do curso: ${error instanceof Error ? error.message : MESSAGES.ERRORS.LOAD_DATA}`,
        );
        navigate('/dashboard'); // Ou outra rota de fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, isAuthenticated, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validações obrigatórias e de limites
    if (!name.trim()) {
      alert('CourseSphere: O nome do curso é obrigatório.');
      setIsProcessing(false);
      return;
    }
    if (name.trim().length < 3) {
      alert('CourseSphere: O nome do curso deve ter no mínimo 3 caracteres.');
      setIsProcessing(false);
      return;
    }
    if (description.trim().length > 500) {
      alert(
        'CourseSphere: A descrição do curso não pode exceder 500 caracteres.',
      );
      setIsProcessing(false);
      return;
    }
    if (!startDate.trim()) {
      alert('CourseSphere: A data de início é obrigatória.');
      setIsProcessing(false);
      return;
    }
    if (!endDate.trim()) {
      alert('CourseSphere: A data de término é obrigatória.');
      setIsProcessing(false);
      return;
    }
    if (
      new Date(startDate).toString() === 'Invalid Date' ||
      new Date(endDate).toString() === 'Invalid Date'
    ) {
      alert('CourseSphere: Data(s) inválida(s). Use o formato AAAA-MM-DD.');
      setIsProcessing(false);
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert(
        'CourseSphere: A data de início não pode ser posterior à data de término.',
      );
      setIsProcessing(false);
      return;
    }

    const newOrUpdatedCourse: Course = {
      // Se estiver editando, usa o ID e creator_id existentes. Se estiver criando, gera novo ID e usa o userId atual.
      id: isEditing && course ? course.id : crypto.randomUUID(),
      creator_id: isEditing && course ? course.creator_id : userId,
      name,
      description: description.trim() || undefined,
      start_date: startDate,
      end_date: endDate,
      instructors: isEditing && course ? course.instructors : [], // Mantém instrutores existentes ou inicia vazio para novo curso
    };

    try {
      const url = isEditing
        ? `http://localhost:3001/courses/${newOrUpdatedCourse.id}`
        : 'http://localhost:3001/courses';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrUpdatedCourse),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message ||
            `Erro ao ${isEditing ? 'editar' : 'criar'} curso.`,
        );
      }

      alert(
        `CourseSphere: Curso ${isEditing ? 'atualizado' : 'criado'} com sucesso!`,
      );
      navigate(`/courses/${newOrUpdatedCourse.id}`); // Navega para a página de detalhes do curso (novo ou atualizado)
    } catch (error: unknown) {
      console.error('CourseSphere: Erro na operação:', error);
      alert(
        `CourseSphere: Erro ao ${isEditing ? 'editar' : 'criar'} curso: ${error instanceof Error ? error.message : MESSAGES.ERRORS.OPERATION_FAILED}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && id) {
      // Se estava editando, volta para os detalhes do curso
      navigate(`/courses/${id}`);
    } else {
      // Se estava criando, volta para o dashboard
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white font-sans">
        <Header userEmail={userEmail} userId={userId} />
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto w-full">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  // Se estiver no modo de edição e o curso não for encontrado (ID inválido ou erro de fetch)
  if (isEditing && !course) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white font-sans">
        <Header userEmail={userEmail} userId={userId} />
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto w-full">
          <p className="text-center text-red-400 text-2xl font-semibold">
            CourseSphere: Curso não encontrado ou você não tem permissão para
            esta ação.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white font-sans">
      <Header userEmail={userEmail} userId={userId} />
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold text-indigo-400 mb-10 text-center tracking-wide drop-shadow-lg">
          {isEditing
            ? `Editar Curso: "${course?.name || 'Carregando...'}"`
            : 'Criar Novo Curso'}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Nome do Curso:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
              placeholder="Ex: Desenvolvimento Web Completo"
              required
              disabled={isProcessing}
              aria-label="Nome do Curso"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Descrição:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
              placeholder="Descreva o conteúdo do curso, o que os alunos aprenderão, etc."
              disabled={isProcessing}
              aria-label="Descrição do Curso"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="start_date"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Data de Início:
            </label>
            <input
              type="date"
              id="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
              required
              disabled={isProcessing}
              aria-label="Data de Início do Curso"
            />
          </div>

          <div>
            <label
              htmlFor="end_date"
              className="block text-gray-300 text-lg font-medium mb-2"
            >
              Data de Término:
            </label>
            <input
              type="date"
              id="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-lg"
              required
              disabled={isProcessing}
              aria-label="Data de Término do Curso"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 rounded-full hover:bg-green-500 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={
                isEditing ? 'Salvar Alterações do Curso' : 'Criar Novo Curso'
              }
            >
              <Save size={20} />{' '}
              {isProcessing
                ? 'Salvando...'
                : isEditing
                  ? 'Salvar Alterações'
                  : 'Criar Curso'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancelar"
            >
              <XCircle size={20} /> Cancelar
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CourseFormPage;
