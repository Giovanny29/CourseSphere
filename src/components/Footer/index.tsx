import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-auto select-none">
      <p>
        &copy; {year} &mdash; Powered by{' '}
        <span className="font-semibold text-blue-500">Koji</span>
      </p>
    </footer>
  );
};

export default Footer;
