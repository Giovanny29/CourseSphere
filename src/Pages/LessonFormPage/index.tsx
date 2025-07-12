import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import ModalConfirm from '../../components/ModalConfirm';
import LessonForm from '../../components/LessonForm';
import { Course, Lesson } from '../../types';
import { MESSAGES } from '../../constants/messages';

const LessonFormPage: React.FC = () => {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const courseIdFromQuery = searchParams.get('course_id');

  const navigate = useNavigate();

  const userId = localStorage.getItem('userId')!;
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userEmail = localStorage.getItem('userEmail') || 'Usuário';

  const [isEditing, setIsEditing] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(
    'draft',
  ); // AGORA INCLUI 'archived'
  const [publishDate, setPublishDate] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let fetchedCourse: Course | null = null;
        let fetchedLesson: Lesson | null = null;
        let actualCourseId: string | null = null;

        if (lessonId && lessonId !== 'new') {
          setIsEditing(true);
          const resLesson = await fetch(
            `http://localhost:3001/lessons/${lessonId}`,
          );
          if (!resLesson.ok) throw new Error(MESSAGES.ERRORS.LESSON_NOT_FOUND);
          fetchedLesson = await resLesson.json();
          setLesson(fetchedLesson);

          if (fetchedLesson) {
            actualCourseId = fetchedLesson.course_id;
          } else {
            throw new Error('Dados da aula não encontrados após a busca.');
          }
        } else {
          setIsEditing(false);
          actualCourseId = courseIdFromQuery;
        }

        if (actualCourseId) {
          const resCourse = await fetch(
            `http://localhost:3001/courses/${actualCourseId}`,
          );
          if (!resCourse.ok) throw new Error(MESSAGES.ERRORS.COURSE_NOT_FOUND);
          fetchedCourse = await resCourse.json();
          setCourse(fetchedCourse);
        } else {
          throw new Error(
            'ID do curso não fornecido para criação/edição da aula.',
          );
        }

        if (fetchedCourse) {
          if (isEditing && fetchedLesson) {
            if (
              fetchedLesson.creator_id !== userId &&
              fetchedCourse.creator_id !== userId
            ) {
              alert(
                'CourseSphere: Você não tem permissão para editar esta aula.',
              );
              navigate(`/courses/${fetchedLesson.course_id}`);
              return;
            }
            setTitle(fetchedLesson.title);
            setStatus(fetchedLesson.status); // AGORA ATRIBUI DIRETAMENTE, SEM CONVERSÃO
            setPublishDate(fetchedLesson.publish_date);
            setVideoUrl(fetchedLesson.video_url);
          } else if (!isEditing) {
            if (
              fetchedCourse.creator_id !== userId &&
              !fetchedCourse.instructors.includes(userId)
            ) {
              alert(
                'CourseSphere: Você não tem permissão para criar aulas neste curso.',
              );
              navigate(`/courses/${fetchedCourse.id}`);
              return;
            }
          }
        }
      } catch (error: unknown) {
        console.error('CourseSphere: Erro ao carregar dados:', error);
        alert(
          `CourseSphere: Erro ao carregar dados: ${error instanceof Error ? error.message : MESSAGES.ERRORS.LOAD_DATA}`,
        );
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    lessonId,
    courseIdFromQuery,
    navigate,
    isAuthenticated,
    userId,
    isEditing,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!course) {
      alert('CourseSphere: Curso não encontrado.');
      setIsProcessing(false);
      return;
    }

    if (!title.trim()) {
      alert('CourseSphere: O título da aula é obrigatório.');
      setIsProcessing(false);
      return;
    }
    if (title.trim().length < 3) {
      // Validação: mínimo 3 caracteres para o título
      alert('CourseSphere: O título da aula deve ter no mínimo 3 caracteres.');
      setIsProcessing(false);
      return;
    }
    if (!publishDate.trim()) {
      alert('CourseSphere: A data de publicação é obrigatória.');
      setIsProcessing(false);
      return;
    }
    if (!videoUrl.trim()) {
      alert('CourseSphere: A URL do vídeo é obrigatória.');
      setIsProcessing(false);
      return;
    }
    if (!videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
      alert(
        'CourseSphere: A URL do vídeo deve começar com "http://" ou "https://".',
      );
      setIsProcessing(false);
      return;
    }
    if (new Date(publishDate).toString() === 'Invalid Date') {
      alert(
        'CourseSphere: Data de publicação inválida. Use o formato AAAA-MM-DD.',
      );
      setIsProcessing(false);
      return;
    }

    const newOrUpdatedLesson: Lesson = {
      id: isEditing && lesson ? lesson.id : crypto.randomUUID(),
      course_id: course.id,
      creator_id: isEditing && lesson ? lesson.creator_id : userId,
      title,
      status,
      publish_date: publishDate,
      video_url: videoUrl,
    };

    try {
      const url = isEditing
        ? `http://localhost:3001/lessons/${newOrUpdatedLesson.id}`
        : 'http://localhost:3001/lessons';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrUpdatedLesson),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message ||
            `Erro ao ${isEditing ? 'editar' : 'criar'} aula.`,
        );
      }

      alert(
        `CourseSphere: Aula ${isEditing ? MESSAGES.SUCCESS.UPDATE_LESSON : MESSAGES.SUCCESS.CREATE_LESSON}`,
      );
      navigate(`/courses/${course.id}`);
    } catch (error: unknown) {
      console.error('CourseSphere: Erro na operação:', error);
      alert(
        `CourseSphere: Erro ao ${isEditing ? 'editar' : 'criar'} aula: ${error instanceof Error ? error.message : MESSAGES.ERRORS.OPERATION_FAILED}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const openDeleteModal = () => {
    setModalVisible(true);
  };

  const confirmDeleteLesson = async () => {
    if (!lesson || !isEditing) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`http://localhost:3001/lessons/${lesson.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao excluir aula.');

      alert(`CourseSphere: ${MESSAGES.SUCCESS.DELETE_LESSON}`);
      navigate(`/courses/${course?.id}`);
    } catch (error: unknown) {
      console.error('CourseSphere: Erro ao excluir aula:', error);
      alert(
        `CourseSphere: Erro ao excluir aula: ${error instanceof Error ? error.message : MESSAGES.ERRORS.DELETE_LESSON}`,
      );
    } finally {
      setIsProcessing(false);
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    if (course) {
      navigate(`/courses/${course.id}`);
    } else {
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

  if (!course) {
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

  const canDeleteLesson = Boolean(
    isEditing &&
      lesson &&
      (lesson.creator_id === userId || course.creator_id === userId),
  );

  return (
    <>
      <Header userEmail={userEmail} userId={userId} />
      <LessonForm
        title={title}
        setTitle={setTitle}
        status={status}
        setStatus={setStatus}
        publishDate={publishDate}
        setPublishDate={setPublishDate}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        isEditing={isEditing}
        isProcessing={isProcessing}
        canDelete={canDeleteLesson}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDelete={openDeleteModal}
        courseName={course.name}
        lessonTitle={lesson?.title}
      />
      <Footer />

      {modalVisible && (
        <ModalConfirm
          message="CourseSphere: Tem certeza que deseja excluir esta aula?"
          onCancel={() => setModalVisible(false)}
          onConfirm={confirmDeleteLesson}
        />
      )}
    </>
  );
};

export default LessonFormPage;
