import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/RegisterForm';
import { toast } from 'react-toastify';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    setErrorMessage(null);
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
      // Validação do formato do email
      if (!emailRegex.test(email)) {
        toast.error('Por favor, insira um e-mail válido.');
        setErrorMessage('Por favor, insira um e-mail válido.');
        return;
      }

      // Validação do tamanho da senha
      if (password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres.');
        setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      // Verifica se já existe usuário com este email
      const checkRes = await fetch(
        `http://localhost:3001/users?email=${email}`,
      );
      const existingUsers = await checkRes.json();

      if (existingUsers.length > 0) {
        toast.error('Este e-mail já está em uso.');
        setErrorMessage('Este e-mail já está em uso.');
        return;
      }

      // Cria novo usuário
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
      };

      await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      console.error('Erro ao registrar usuário:', err);
      toast.error('Erro ao registrar. Tente novamente.');
      setErrorMessage('Erro ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Container do formulário */}
      <div className="w-full md:w-1/2 lg:w-[30%] flex items-center justify-center p-6 bg-gray-900 h-screen md:h-auto">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
          <RegisterForm onRegister={handleRegister} loading={loading} />
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
        style={{ backgroundImage: 'url("/img/registro.png")' }}
      />
    </div>
  );
};

export default RegisterPage;
