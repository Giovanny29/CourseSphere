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
export const MESSAGES = {
  ERRORS: {
    LOAD_DATA: 'Erro ao carregar dados.',
    COURSE_NOT_FOUND: 'Curso não encontrado.',
    REMOVE_INSTRUCTOR: 'Erro ao remover instrutor.',
    ADD_INSTRUCTOR: 'Erro ao adicionar instrutor.',
    INVALID_DATA: 'Dados inválidos do novo instrutor',
    SHORT_PASSWORD: 'Senha do novo instrutor muito curta',
    FETCH_USER: 'Erro ao buscar usuário externo',
    CREATE_USER: 'Erro ao salvar novo instrutor',
    UPDATE_COURSE: 'Erro ao atualizar instrutores do curso',
    LESSONS_NOT_FOUND: 'Erro ao buscar aulas do instrutor',
    DELETE_COURSE: 'Erro ao deletar curso',
  },
  SUCCESS: {
    REMOVE_INSTRUCTOR: 'Instrutor e suas aulas removidos com sucesso!',
    ADD_INSTRUCTOR: 'Novo instrutor adicionado com sucesso!',
    DELETE_COURSE: 'Curso deletado com sucesso!',
  },
  UI: {
    ADDING: 'Adicionando...',
    ADD_BUTTON: 'Adicionar Novo Instrutor',
    REMOVE_BUTTON: 'Remover',
    DELETE_COURSE_BUTTON: 'Excluir Curso',
    MODAL_CONFIRM: 'Tem certeza que deseja remover este instrutor?',
    NO_INSTRUCTORS: 'Nenhum instrutor cadastrado ainda.',
  },
};
