import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../types';
import CourseList from '../../components/CourseList';
import CreateCourseButton from '../../components/CreateCourseButton';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    if (!userId || !isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:3001/courses');
        const data: Course[] = await res.json();

        const filtered = data.filter(
          (course) =>
            course.creator_id === userId || course.instructors.includes(userId),
        );

        setCourses(filtered);
      } catch (err) {
        console.error('Erro ao buscar cursos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate, userId, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-purple-700 via-indigo-800 to-blue-900 text-white">
      <Header />

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        {/* Top bar com título e perfil */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold select-none">Meus Cursos</h1>

          <div className="flex items-center space-x-4 bg-indigo-900 bg-opacity-30 rounded-lg p-3">
            <img
              src="/img/profile-generic.png"
              alt="Perfil"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <div>
              <p className="font-semibold">{userEmail || 'Usuário'}</p>
              <p className="text-sm text-indigo-200 select-text">{userId}</p>
            </div>
          </div>
        </div>

        <CreateCourseButton />

        <div className="mt-8">
          {loading ? (
            <p className="text-center text-indigo-200">Carregando cursos...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-indigo-200">
              Nenhum curso encontrado.
            </p>
          ) : (
            <CourseList courses={courses} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
