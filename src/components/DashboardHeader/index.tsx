import React from 'react';
import UserHeader from '../UserHeader';

interface DashboardHeaderProps {
  userId: string | null;
  userEmail: string | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userId,
  userEmail,
}) => {
  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <img
          src="/img/sphere.png"
          alt="Sphere Course Logo"
          className="h-12 w-12"
        />
        <h1 className="text-2xl font-bold">SphereCourse</h1>
      </div>

      <UserHeader userId={userId ?? 'Usuário'} userEmail={userEmail ?? ''} />
    </header>
  );
};

export default DashboardHeader;
