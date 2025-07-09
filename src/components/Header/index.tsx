import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userEmail: string;
  userId: string;
}

const Header: React.FC<HeaderProps> = ({ userEmail, userId }) => {
  const navigate = useNavigate();

  // Função única para navegar para o dashboard
  const goToDashboard = () => navigate('/dashboard');

  return (
    <header className="flex flex-wrap items-center justify-between bg-gray-900 p-4 shadow-md">
      <div
        className="flex items-center cursor-pointer transform transition-transform duration-300 hover:scale-105"
        onClick={goToDashboard}
      >
        <img
          src="/img/sphere.png"
          alt="SphereCourse Logo"
          className="h-10 w-10 mr-3"
        />
        <h1 className="text-white text-2xl font-bold select-none whitespace-nowrap">
          SphereCourse
        </h1>
      </div>

      <div
        className="flex items-center space-x-3 min-w-[150px] mt-3 sm:mt-0 cursor-pointer"
        onClick={goToDashboard}
      >
        <img
          src="/img/generic.png"
          alt="User profile"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="truncate">
          <p className="font-semibold text-white text-sm sm:text-base">
            {userEmail}
          </p>
          <p className="text-xs text-gray-300 truncate max-w-[150px]">
            {userId}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
