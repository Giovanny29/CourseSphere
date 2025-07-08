// src/constants/messages.ts

export const AUTH_MESSAGES = {
  // Validações do formulário de login
  FIELDS_REQUIRED: 'Por favor, preencha todos os campos.',
  INVALID_EMAIL_FORMAT: 'Por favor, insira um email válido.',
  PASSWORD_TOO_SHORT: 'A senha deve ter mais de 6 caracteres.',

  // Mensagens de erro de autenticação
  INVALID_CREDENTIALS: 'Email ou senha inválidos.',
  HTTP_ERROR: 'Erro HTTP na requisição de login:',
  SERVER_COMMUNICATION_ERROR: 'Erro na comunicação com o servidor.',
  NETWORK_ERROR:
    'Ocorreu um erro de rede. Verifique sua conexão ou tente novamente.',
  UNKNOWN_LOGIN_ERROR: 'Ocorreu um erro desconhecido ao tentar fazer login.',

  // Mensagens de sucesso (opcional, mas bom para consistência)
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Sessão encerrada com sucesso.',
};

// Você pode adicionar outras categorias de mensagens aqui, se precisar
export const GENERAL_MESSAGES = {
  // Exemplo:
  DATA_FETCH_ERROR: 'Não foi possível carregar os dados.',
  SUCCESS_OPERATION: 'Operação realizada com sucesso!',
};
