import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, Lesson, User } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ModalConfirm from '../../components/ModalConfirm';
import { paginate, getTotalPages } from '../../utils/pagination';
import CourseInfo from '../../components/CourseInfo';
import LessonFilters from '../../components/LessonFilters';
import LessonList from '../../components/LessonList';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MESSAGES } from '../../constants/messages';
import { PlusCircle, Edit3, Users, Trash2 } from 'lucide-react';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId')!;
  const userEmail = localStorage.getItem('userEmail') || 'Usuário';
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [deletingCourse, setDeletingCourse] = useState(false);

  const [lessonSearch, setLessonSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const [resCourse, resLessons, resUsers] = await Promise.all([
          fetch(`http://localhost:3001/courses/${id}`),
          fetch(`http://localhost:3001/lessons?course_id=${id}`),
          fetch('http://localhost:3001/users'),
        ]);

        if (!resCourse.ok) throw new Error(MESSAGES.ERRORS.COURSE_NOT_FOUND);
        const courseData: Course = await resCourse.json();
        const lessonData: Lesson[] = await resLessons.json();
        const userData: User[] = await resUsers.json();

        setCourse(courseData);
        setLessons(lessonData);
        setUsers(userData);
      } catch (error: unknown) {
        console.error(
          'CourseSphere: Erro ao carregar curso, aulas ou usuários:',
          error,
        );
        alert(
          `CourseSphere: Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        );
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, isAuthenticated, userId]);

  const getUserNameById = (uid: string) =>
    users.find((u) => u.id === uid)?.name || uid;

  const isCreator = course?.creator_id === userId;
  const isInstructor = course?.instructors.includes(userId) || false;

  const filteredLessons = lessons.filter((lesson) => {
    const matchesTitle = lesson.title
      .toLowerCase()
      .includes(lessonSearch.toLowerCase());
    const matchesStatus =
      selectedStatus === '' || lesson.status === selectedStatus;
    const matchesInstructor =
      selectedInstructor === '' || lesson.creator_id === selectedInstructor;
    return matchesTitle && matchesStatus && matchesInstructor;
  });

  const totalPages = getTotalPages(filteredLessons.length, itemsPerPage);
  const paginatedLessons = paginate(filteredLessons, currentPage, itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredLessons.length, totalPages, currentPage]);

  const goToPrevPage = async () => {
    if (currentPage <= 1) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 300));
    setCurrentPage((p) => Math.max(p - 1, 1));
    setIsProcessing(false);
  };

  const goToNextPage = async () => {
    if (currentPage >= totalPages) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 300));
    setCurrentPage((p) => Math.min(p + 1, totalPages));
    setIsProcessing(false);
  };

  const handleSetLessonSearch = (val: string) => {
    setLessonSearch(val);
    setCurrentPage(1);
  };

  const handleSetSelectedStatus = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handleSetSelectedInstructor = (val: string) => {
    setSelectedInstructor(val);
    setCurrentPage(1);
  };

  const openDeleteLessonModal = (lessonId: string) => {
    setDeletingLessonId(lessonId);
    setDeletingCourse(false);
    setModalVisible(true);
  };

  const openDeleteCourseModal = () => {
    setDeletingCourse(true);
    setDeletingLessonId(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setDeletingLessonId(null);
    setDeletingCourse(false);
  };

  const confirmDeleteLesson = async () => {
    if (!deletingLessonId) return;
    setIsProcessing(true);
    try {
      const res = await fetch(
        `http://localhost:3001/lessons/${deletingLessonId}`,
        { method: 'DELETE' },
      );
      if (!res.ok) throw new Error('Erro ao excluir aula');
      setLessons((prev) =>
        prev.filter((lesson) => lesson.id !== deletingLessonId),
      );
      alert('CourseSphere: Aula excluída com sucesso!');
    } catch (error: unknown) {
      console.error('CourseSphere: Erro ao excluir aula:', error);
      alert('CourseSphere: Erro ao excluir aula. Tente novamente.');
    }
    setIsProcessing(false);
    closeModal();
  };

  const confirmDeleteCourse = async () => {
    if (!course) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`http://localhost:3001/courses/${course.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao excluir curso');
      alert('CourseSphere: Curso excluído com sucesso!');
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('CourseSphere: Erro ao excluir curso:', error);
      alert('CourseSphere: Erro ao excluir curso. Tente novamente.');
    }
    setIsProcessing(false);
    closeModal();
  };

  const goToEditCourse = () => {
    navigate(`/courses/edit/${id}`);
  };

  const goToCreateLesson = () => {
    navigate(`/lessons/create?course_id=${id}`);
  };

  const goToEditLesson = (lessonId: string) => {
    navigate(`/lessons/edit/${lessonId}`);
  };

  const goToManageInstructors = () => {
    navigate(`/courses/${id}/instructors`);
  };

  if (loading || isProcessing)
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white font-sans">
        <Header userEmail={userEmail} userId={userId} />
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto w-full">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white font-sans">
        <Header userEmail={userEmail} userId={userId} />
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto w-full">
          <p className="text-center text-red-400 text-2xl font-semibold">
            {MESSAGES.ERRORS.COURSE_NOT_FOUND}
          </p>
        </main>
        <Footer />
      </div>
    );

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white font-sans">
        <Header userEmail={userEmail} userId={userId} />
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto w-full">
          <CourseInfo course={course} users={users} />

          <LessonFilters
            lessonSearch={lessonSearch}
            setLessonSearch={handleSetLessonSearch}
            selectedStatus={selectedStatus}
            setSelectedStatus={handleSetSelectedStatus}
            selectedInstructor={selectedInstructor}
            setSelectedInstructor={handleSetSelectedInstructor}
            instructors={course.instructors}
            getUserNameById={getUserNameById}
          />

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-indigo-300 mb-6 border-b-2 border-gray-700 pb-2">
              Aulas do Curso
            </h2>
            {paginatedLessons.length === 0 && (
              <p className="text-center text-gray-400 text-lg py-8">
                {lessons.length === 0
                  ? 'Nenhuma aula cadastrada para este curso ainda.'
                  : 'Nenhuma aula encontrada com os filtros aplicados.'}
              </p>
            )}
            <LessonList
              lessons={paginatedLessons}
              getUserNameById={getUserNameById}
              isCreator={isCreator}
              userId={userId}
              onDeleteLesson={openDeleteLessonModal}
              onEditLesson={goToEditLesson}
            />
            {filteredLessons.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={goToPrevPage}
                onNextPage={goToNextPage}
              />
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-12 mb-8 p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            {isCreator && (
              <>
                <button
                  className={`flex items-center gap-2 px-6 py-3 bg-blue-700 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={goToEditCourse}
                  disabled={isProcessing}
                  aria-label="Editar curso"
                >
                  <Edit3 size={20} /> Editar Curso
                </button>
                <button
                  className={`flex items-center gap-2 px-6 py-3 bg-gray-900 rounded-full hover:bg-gray-800 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-900 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={goToManageInstructors}
                  disabled={isProcessing}
                  aria-label="Gerenciar instrutores do curso"
                >
                  <Users size={20} /> Gerenciar Instrutores
                </button>
                <button
                  className={`flex items-center gap-2 px-6 py-3 bg-rose-700 rounded-full hover:bg-rose-600 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={openDeleteCourseModal}
                  disabled={isProcessing}
                  aria-label="Excluir curso"
                >
                  <Trash2 size={20} /> Excluir Curso
                </button>
              </>
            )}
            {(isCreator || isInstructor) && (
              <button
                className={`flex items-center gap-2 px-6 py-3 bg-purple-700 rounded-full hover:bg-purple-600 transition duration-300 ease-in-out text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={goToCreateLesson}
                disabled={isProcessing}
                aria-label="Criar nova aula"
              >
                <PlusCircle size={20} /> Criar Nova Aula
              </button>
            )}
          </div>
        </main>
        <Footer />
      </div>

      {modalVisible && (
        <ModalConfirm
          message={
            deletingCourse
              ? 'CourseSphere: Tem certeza que deseja excluir este curso? Todas as aulas também serão removidas!'
              : 'CourseSphere: Tem certeza que deseja excluir esta aula?'
          }
          onCancel={closeModal}
          onConfirm={deletingCourse ? confirmDeleteCourse : confirmDeleteLesson}
        />
      )}
    </>
  );
};

export default CourseDetailsPage;
