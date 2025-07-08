import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void | Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md mx-auto flex flex-col items-center"
    >
      {/* Imagem decorativa */}
      <img src="/img/sphere.png" alt="Sphere" className="w-20 h-20 mb-6" />

      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Bem-vindo de volta
      </h2>

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

      <div className="w-full mb-6">
        <label
          htmlFor="password"
          className="block text-white text-sm font-semibold mb-2"
        >
          Senha
        </label>
        <input
          type="password"
          id="password"
          placeholder="Sua senha"
          className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        aria-busy={loading}
        disabled={loading}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginForm;
