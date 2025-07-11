import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../types';
import CourseList from '../../components/CourseList';
import CreateCourseButton from '../../components/CreateCourseButton';
import Footer from '../../components/Footer';
import CourseFilter from '../../components/CouseFilter';
import { filterCourses } from '../../utils/courseFilters';
import { paginate, getTotalPages } from '../../utils/pagination';
import Header from '../../components/Header';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseNameFilter, setCourseNameFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const userId = localStorage.getItem('userId')!;
  const userEmail = localStorage.getItem('userEmail') || 'Usuário';
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

  const filteredCourses = filterCourses(courses, {
    courseNameQuery: courseNameFilter,
  });

  const totalPages = getTotalPages(filteredCourses.length, itemsPerPage);
  const paginatedCourses = paginate(filteredCourses, currentPage, itemsPerPage);

  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-gray-900 via-gray-800 to-purple-900 text-white">
      <Header userEmail={userEmail} userId={userId} />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-5xl font-extrabold font-serif bg-gradient-to-r from-green-300 via-green-200 to-purple-200 bg-clip-text text-transparent">
            Meus Cursos
          </h2>
          <CreateCourseButton />
        </div>

        <CourseFilter
          searchQuery={courseNameFilter}
          onSearchChange={(value) => {
            setCourseNameFilter(value);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <p className="text-center text-gray-300 mt-12">
            Carregando cursos...
          </p>
        ) : paginatedCourses.length === 0 ? (
          <p className="text-center text-gray-300 mt-12">
            Nenhum curso encontrado.
          </p>
        ) : (
          <>
            <div className="mt-8">
              <CourseList courses={paginatedCourses} />
            </div>

            <div className="flex justify-center mt-16 mb-12 space-x-4">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-white font-semibold disabled:opacity-50 transition"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-lg">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded text-white font-semibold disabled:opacity-50 transition"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
