/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import ModalConfirm from '../../components/ModalConfirm';
import { Course, Lesson, User } from '../../types';
import { MESSAGES } from '../../constants/messages';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';

const ManageInstructorsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail') || 'Usuário';
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const [course, setCourse] = useState<Course | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [removingInstructorId, setRemovingInstructorId] = useState<
    string | null
  >(null);

  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      navigate('/login');
      return;
    }

    const fetchCourseAndUsers = async () => {
      setLoading(true);
      try {
        const [courseRes, usersRes] = await Promise.all([
          fetch(`http://localhost:3001/courses/${id}`),
          fetch(`http://localhost:3001/users`),
        ]);

        if (!courseRes.ok) throw new Error(MESSAGES.ERRORS.COURSE_NOT_FOUND);

        const courseData: Course = await courseRes.json();
        const userData: User[] = await usersRes.json();

        if (courseData.creator_id !== userId) {
          alert(
            'CourseSphere: Acesso negado. Apenas o criador do curso pode gerenciar instrutores.',
          );
          navigate('/dashboard');
          return;
        }

        setCourse(courseData);
        setUsers(userData);
      } catch (err: any) {
        console.error(err);
        alert(
          `CourseSphere: Erro ao carregar dados: ${err.message || MESSAGES.ERRORS.LOAD_DATA}`,
        );
        navigate('/dashboard');
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchCourseAndUsers();
  }, [id, userId, isAuthenticated, navigate]);

  const openRemoveModal = (instructorId: string) => {
    setRemovingInstructorId(instructorId);
    setModalVisible(true);
  };

  const closeModal = () => {
    setRemovingInstructorId(null);
    setModalVisible(false);
  };

  const confirmRemoveInstructor = async () => {
    if (!removingInstructorId || !course) return;
    setIsProcessing(true);

    try {
      const isCreator = removingInstructorId === course.creator_id;

      if (isCreator) {
        const resLessons = await fetch(
          `http://localhost:3001/lessons?course_id=${course.id}`,
        );
        if (!resLessons.ok) throw new Error(MESSAGES.ERRORS.LESSONS_NOT_FOUND);
        const lessons = await resLessons.json();
        await Promise.all(
          lessons.map((lesson: Lesson) =>
            fetch(`http://localhost:3001/lessons/${lesson.id}`, {
              method: 'DELETE',
            }),
          ),
        );

        const resCourseDelete = await fetch(
          `http://localhost:3001/courses/${course.id}`,
          {
            method: 'DELETE',
          },
        );
        if (!resCourseDelete.ok) throw new Error(MESSAGES.ERRORS.DELETE_COURSE);

        closeModal();
        alert(`CourseSphere: ${MESSAGES.SUCCESS.DELETE_COURSE}`);
        navigate('/dashboard');
      } else {
        const resLessons = await fetch(
          `http://localhost:3001/lessons?creator_id=${removingInstructorId}&course_id=${course.id}`,
        );
        if (!resLessons.ok) throw new Error(MESSAGES.ERRORS.LESSONS_NOT_FOUND);
        const lessons = await resLessons.json();

        await Promise.all(
          lessons.map((lesson: Lesson) =>
            fetch(`http://localhost:3001/lessons/${lesson.id}`, {
              method: 'DELETE',
            }),
          ),
        );

        const updatedInstructors = course.instructors.filter(
          (id) => id !== removingInstructorId,
        );
        const res = await fetch(`http://localhost:3001/courses/${course.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instructors: updatedInstructors }),
        });

        if (!res.ok) throw new Error(MESSAGES.ERRORS.REMOVE_INSTRUCTOR);

        const removedUser = users.find((u) => u.id === removingInstructorId);
        setCourse((prev) =>
          prev ? { ...prev, instructors: updatedInstructors } : null,
        );
        setUsers((prev) => prev.filter((u) => u.id !== removingInstructorId));

        closeModal();
        alert(
          `CourseSphere: Instrutor ${removedUser?.name || ''} foi removido com sucesso.`,
        );
      }
    } catch (error: any) {
      console.error(error);
      closeModal();
      alert(
        `CourseSphere: Erro: ${error.message || MESSAGES.ERRORS.REMOVE_INSTRUCTOR}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const addNewInstructor = async () => {
    setIsAdding(true);

    try {
      const res = await fetch('https://randomuser.me/api/');
      if (!res.ok) throw new Error(MESSAGES.ERRORS.FETCH_USER);
      const data = await res.json();
      const userInfo = data.results[0];

      const newUser: User = {
        id: crypto.randomUUID(),
        name: `${userInfo.name.first} ${userInfo.name.last}`,
        email: userInfo.email,
        password: Math.random().toString(36).slice(-8),
      };

      if (!newUser.name || !newUser.email || !newUser.password)
        throw new Error(MESSAGES.ERRORS.INVALID_DATA);
      if (newUser.password.length < 6)
        throw new Error(MESSAGES.ERRORS.SHORT_PASSWORD);

      const resCreate = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!resCreate.ok) throw new Error(MESSAGES.ERRORS.CREATE_USER);

      if (!course) throw new Error(MESSAGES.ERRORS.COURSE_NOT_FOUND);
      const updatedInstructors = [...course.instructors, newUser.id];

      const resCourseUpdate = await fetch(
        `http://localhost:3001/courses/${course.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instructors: updatedInstructors }),
        },
      );

      if (!resCourseUpdate.ok) throw new Error(MESSAGES.ERRORS.UPDATE_COURSE);

      setCourse({ ...course, instructors: updatedInstructors });
      setUsers((prev) => [...prev, newUser]);
      alert(
        `CourseSphere: Novo instrutor adicionado com sucesso! Seja bem-vindo, ${newUser.name}`,
      );
    } catch (error: any) {
      console.error(error);
      alert(
        `CourseSphere: Erro ao adicionar instrutor: ${error.message || MESSAGES.ERRORS.ADD_INSTRUCTOR}`,
      );
    } finally {
      setIsAdding(false);
    }
  };

  const instructors = users.filter((user) =>
    course?.instructors.includes(user.id),
  );

  const handleReturnToCourse = () => {
    if (id) {
      navigate(`/courses/${id}`);
    } else {
      alert('CourseSphere: ID do curso não encontrado para retornar.');
      navigate('/dashboard');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
        <Header userEmail={userEmail} userId={userId || ''} />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
        <Header userEmail={userEmail} userId={userId || ''} />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-400 font-medium text-lg">
            {MESSAGES.ERRORS.COURSE_NOT_FOUND}
          </p>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
      <Header userEmail={userEmail} userId={userId || ''} />

      <main className="flex-grow px-6 py-10 max-w-4xl mx-auto">
        {/* Título da Página - MAIOR E COM MAIS ESTILO */}
        <h1 className="text-5xl font-extrabold text-indigo-400 mb-12 text-center tracking-wider drop-shadow-lg leading-tight">
          Gerenciar Instrutores de "{course.name}"
        </h1>

        {/* Botão Adicionar Novo Instrutor */}
        <button
          onClick={addNewInstructor}
          disabled={isAdding || isProcessing}
          className="mb-8 px-6 py-3 bg-emerald-600 rounded-full hover:bg-emerald-500 transition duration-300 ease-in-out flex items-center justify-center gap-2 disabled:opacity-50 text-lg font-semibold shadow-md mx-auto focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <Plus size={20} />
          {isAdding ? MESSAGES.UI.ADDING : MESSAGES.UI.ADD_BUTTON}
        </button>

        {/* Lista de Instrutores */}
        <ul className="space-y-4 mb-8">
          {instructors.length === 0 && (
            <p className="text-gray-400 text-lg italic text-center py-4">
              {MESSAGES.UI.NO_INSTRUCTORS}
            </p>
          )}
          {instructors.map((inst) => (
            <li
              key={inst.id}
              className="flex justify-between items-center bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.01] hover:border-violet-500 hover:shadow-violet-800/50"
            >
              <div>
                <p className="font-semibold text-xl text-white tracking-tight">
                  {inst.name}
                </p>
                <p className="text-base text-gray-400 font-light">
                  {inst.email}
                </p>
              </div>

              <button
                onClick={() => openRemoveModal(inst.id)}
                disabled={isProcessing}
                className="px-5 py-2 bg-rose-700 rounded-lg hover:bg-rose-600 transition duration-300 ease-in-out disabled:opacity-50 flex items-center gap-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Trash2 size={18} />
                {inst.id === course.creator_id
                  ? MESSAGES.UI.DELETE_COURSE_BUTTON
                  : MESSAGES.UI.REMOVE_BUTTON}
              </button>
            </li>
          ))}
        </ul>

        {/* Botão de Retornar ao Curso */}
        <div className="mt-12 pt-6 border-t border-gray-700 flex justify-center">
          <button
            onClick={handleReturnToCourse}
            className="px-8 py-3 bg-blue-700 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300 ease-in-out text-xl font-bold text-white shadow-lg flex items-center gap-2"
          >
            <ArrowLeft size={22} />
            Retornar ao Curso
          </button>
        </div>
      </main>

      <Footer />

      {modalVisible && (
        <ModalConfirm
          message={MESSAGES.UI.MODAL_CONFIRM}
          onCancel={closeModal}
          onConfirm={confirmRemoveInstructor}
        />
      )}
    </div>
  );
};

export default ManageInstructorsPage;
