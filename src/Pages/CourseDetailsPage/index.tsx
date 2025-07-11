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
        await new Promise((resolve) => setTimeout(resolve, 3000)); // simulação
        const [resCourse, resLessons, resUsers] = await Promise.all([
          fetch(`http://localhost:3001/courses/${id}`),
          fetch(`http://localhost:3001/lessons?course_id=${id}`),
          fetch('http://localhost:3001/users'),
        ]);

        if (!resCourse.ok) throw new Error('Curso não encontrado');
        const courseData: Course = await resCourse.json();
        const lessonData: Lesson[] = await resLessons.json();
        const userData: User[] = await resUsers.json();

        setCourse(courseData);
        setLessons(lessonData);
        setUsers(userData);
      } catch (error) {
        console.error('Erro ao carregar curso, aulas ou usuários:', error);
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

  const goToPrevPage = async () => {
    if (currentPage <= 1) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setCurrentPage((p) => Math.max(p - 1, 1));
    setIsProcessing(false);
  };

  const goToNextPage = async () => {
    if (currentPage >= totalPages) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    setCurrentPage((p) => Math.min(p + 1, totalPages));
    setIsProcessing(false);
  };

  const handleSetLessonSearch = async (val: string) => {
    setIsProcessing(true);
    setLessonSearch(val);
    setCurrentPage(1);
    await new Promise((r) => setTimeout(r, 500));
    setIsProcessing(false);
  };

  const handleSetSelectedStatus = async (val: string) => {
    setIsProcessing(true);
    setSelectedStatus(val);
    setCurrentPage(1);
    await new Promise((r) => setTimeout(r, 500));
    setIsProcessing(false);
  };

  const handleSetSelectedInstructor = async (val: string) => {
    setIsProcessing(true);
    setSelectedInstructor(val);
    setCurrentPage(1);
    await new Promise((r) => setTimeout(r, 500));
    setIsProcessing(false);
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
    } catch (error) {
      console.log(error);
      alert('Erro ao excluir aula.');
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
      alert('Curso excluído com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      alert('Erro ao excluir curso.');
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

  const goToManageInstructors = () => {
    navigate(`/courses/${id}/instructors`);
  };

  if (loading || isProcessing)
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white">
        <Header userEmail={userEmail} userId={userId} />
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto w-full">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );

  if (!course)
    return (
      <p className="text-center text-red-400 mt-12">Curso não encontrado.</p>
    );

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white">
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
            <h2 className="text-2xl font-semibold mb-4">Aulas</h2>
            <LessonList
              lessons={paginatedLessons}
              getUserNameById={getUserNameById}
              isCreator={isCreator}
              userId={userId}
              onDeleteLesson={openDeleteLessonModal}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevPage={goToPrevPage}
              onNextPage={goToNextPage}
            />
          </div>

          {isCreator && (
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
                onClick={goToEditCourse}
              >
                Editar Curso
              </button>
              <button
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition"
                onClick={goToManageInstructors}
              >
                Gerenciar Instrutores
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
                onClick={openDeleteCourseModal}
              >
                Excluir Curso
              </button>
            </div>
          )}

          {(isCreator || isInstructor) && (
            <div className="mt-6">
              <button
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-semibold"
                onClick={goToCreateLesson}
              >
                Criar Nova Aula
              </button>
            </div>
          )}
        </main>
        <Footer />
      </div>

      {modalVisible && (
        <ModalConfirm
          message={
            deletingCourse
              ? 'Tem certeza que deseja excluir este curso?'
              : 'Tem certeza que deseja excluir esta aula?'
          }
          onCancel={closeModal}
          onConfirm={deletingCourse ? confirmDeleteCourse : confirmDeleteLesson}
        />
      )}
    </>
  );
};

export default CourseDetailsPage;
