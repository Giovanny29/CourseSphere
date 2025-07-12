import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || '';
  const userEmail = localStorage.getItem('userEmail') || 'Usuário';

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: `url('/img/not_found.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      <Header userEmail={userEmail} userId={userId} />
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto w-full text-center relative">
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-6xl sm:text-7xl font-extrabold text-white mb-2 drop-shadow-lg">
            404
          </h2>
          <p className="text-2xl sm:text-3xl font-semibold text-white mb-8">
            Página Não Encontrada
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-gradient-to-br from-[#4FC0C0] to-[#2E9A9A] rounded-full text-white font-semibold text-lg
                       shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-[#4FC0C0] focus:ring-offset-2 focus:ring-offset-gray-900
                       border border-[#4FC0C0] hover:border-[#3AB7B7]"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
