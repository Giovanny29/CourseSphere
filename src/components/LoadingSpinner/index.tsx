import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-16 h-16">
        {/* Círculo externo com borda mais grossa */}
        <div className="w-16 h-16 border-[12px] border-white border-t-transparent rounded-full animate-spin" />
        {/* Círculo interno com borda mais grossa */}
        <div className="absolute top-3.5 left-3.5 w-9 h-9 border-[12px] border-white border-b-transparent rounded-full animate-spin-reverse" />
      </div>
      <p className="mt-4 text-white font-bold text-lg">Loading...</p>
    </div>
  );
};

export default Spinner;
