import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between bg-gray-900 p-4 shadow-md">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <img
          src="/img/sphere.png"
          alt="SphereCourse Logo"
          className="h-10 w-10 mr-3"
        />
        <h1 className="text-white text-2xl font-bold select-none">
          SphereCourse
        </h1>
      </div>
    </header>
  );
};

export default Header;
