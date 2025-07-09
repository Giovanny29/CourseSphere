import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface RegisterFormProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
  ) => void | Promise<void>;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, loading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(name, email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md mx-auto flex flex-col items-center"
    >
      <img src="/img/sphere.png" alt="Sphere" className="w-20 h-20 mb-6" />

      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Crie sua conta
      </h2>

      {/* Nome */}
      <div className="w-full mb-4">
        <label
          htmlFor="name"
          className="block text-white text-sm font-semibold mb-2"
        >
          Nome
        </label>
        <input
          type="text"
          id="name"
          placeholder="Seu nome completo"
          className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Email */}
      <div className="w-full mb-4">
        <label
          htmlFor="email"
          className="block text-white text-sm font-semibold mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="exemplo@dominio.com"
          className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Senha com botão mostrar/ocultar */}
      <div className="w-full mb-6 relative">
        <label
          htmlFor="password"
          className="block text-white text-sm font-semibold mb-2"
        >
          Senha
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          placeholder="Mínimo 6 caracteres"
          className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-9 right-3 text-white hover:text-blue-400 focus:outline-none"
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.955 9.955 0 012.366-3.645M6.1 6.1a9.969 9.969 0 0111.803 11.803M3 3l18 18"
              />
            </svg>
          )}
        </button>
      </div>

      <button
        type="submit"
        aria-busy={loading}
        disabled={loading}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Registrando...' : 'Registrar'}
      </button>

      <p className="mt-4 text-sm text-gray-300">
        Já tem uma conta?{' '}
        <Link
          to="/login"
          className="text-blue-400 hover:text-blue-600 font-semibold"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
