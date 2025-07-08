import { AUTH_MESSAGES } from '../constants/messages';
import { User } from '../types';

const API_BASE_URL = 'http://localhost:3001';

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  if (!email || !password) {
    return { success: false, message: AUTH_MESSAGES.FIELDS_REQUIRED };
  }

  if (!isValidEmail(email)) {
    return { success: false, message: AUTH_MESSAGES.INVALID_EMAIL_FORMAT };
  }

  if (password.length < 6) {
    return { success: false, message: AUTH_MESSAGES.PASSWORD_TOO_SHORT };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/users?email=${email}&password=${password}`,
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, message: AUTH_MESSAGES.INVALID_CREDENTIALS };
      }
      const errorText = await response.text();
      console.error(
        'Erro HTTP na requisição de login:',
        response.status,
        errorText,
      );
      return {
        success: false,
        message: `${AUTH_MESSAGES.SERVER_COMMUNICATION_ERROR} (Status: ${response.status}).`,
      };
    }

    const users = await response.json();

    if (users.length > 0) {
      const user = users[0];
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      console.log(AUTH_MESSAGES.LOGIN_SUCCESS, user);
      return { success: true, user: user };
    } else {
      return { success: false, message: AUTH_MESSAGES.INVALID_CREDENTIALS };
    }
  } catch (e) {
    console.error('Erro de rede ou inesperado na authService:', e);
    return { success: false, message: AUTH_MESSAGES.NETWORK_ERROR };
  }
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  console.log(AUTH_MESSAGES.LOGOUT_SUCCESS);
};

export const isAuthenticated = (): boolean => {
  return (
    localStorage.getItem('isAuthenticated') === 'true' &&
    localStorage.getItem('userId') !== null
  );
};
