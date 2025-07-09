import React from 'react';

interface UserHeaderProps {
  userId: string;
  userEmail: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ userId, userEmail }) => (
  <div className="flex items-center space-x-3">
    <img
      src="/img/generic.png"
      alt="User profile"
      className="h-10 w-10 rounded-full object-cover"
    />
    <div>
      <p className="font-semibold">{userId}</p>
      <p className="text-sm text-gray-300 truncate max-w-[200px]">
        {userEmail}
      </p>
    </div>
  </div>
);

export default UserHeader;
