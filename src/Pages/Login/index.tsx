import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import { login } from '../../auth/authService';
import { toast } from 'react-toastify';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setErrorMessage(null);

    const result = await login(email, password);
    console.log(result);

    if (result.success) {
      toast.success(result.message || 'Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Erro desconhecido ao fazer login.');
      setErrorMessage(result.message || 'Erro desconhecido ao fazer login.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Container do formulário */}
      <div className="w-full md:w-1/2 lg:w-[30%] flex items-center justify-center p-6 bg-gray-900 h-screen md:h-auto">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
          <LoginForm onLogin={handleLogin} />
          {errorMessage && (
            <p className="text-red-500 text-center mt-4 text-sm font-semibold">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {/* Imagem lateral responsiva */}
      <div
        className="hidden md:block md:w-1/2 lg:w-[70%] h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url("/img/login.png")' }}
      />
    </div>
  );
};

export default Login;
