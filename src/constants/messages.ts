export const AUTH_MESSAGES = {
  FIELDS_REQUIRED: 'Por favor, preencha todos os campos.',
  INVALID_EMAIL_FORMAT: 'Por favor, insira um email válido.',
  PASSWORD_TOO_SHORT: 'A senha deve ter mais de 6 caracteres.',

  INVALID_CREDENTIALS: 'Email ou senha inválidos.',
  HTTP_ERROR: 'Erro HTTP na requisição de login:',
  SERVER_COMMUNICATION_ERROR: 'Erro na comunicação com o servidor.',
  NETWORK_ERROR:
    'Ocorreu um erro de rede. Verifique sua conexão ou tente novamente.',
  UNKNOWN_LOGIN_ERROR: 'Ocorreu um erro desconhecido ao tentar fazer login.',

  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Sessão encerrada com sucesso.',
};

export const GENERAL_MESSAGES = {
  DATA_FETCH_ERROR: 'Não foi possível carregar os dados.',
  SUCCESS_OPERATION: 'Operação realizada com sucesso!',
};

export const MESSAGES = {
  ERRORS: {
    LOAD_DATA: 'Erro ao carregar dados.',
    COURSE_NOT_FOUND: 'Curso não encontrado.',
    LESSON_NOT_FOUND: 'Aula não encontrada.',
    REMOVE_INSTRUCTOR: 'Erro ao remover instrutor.',
    ADD_INSTRUCTOR: 'Erro ao adicionar instrutor.',
    INVALID_DATA: 'Dados inválidos do novo instrutor',
    SHORT_PASSWORD: 'Senha do novo instrutor muito curta',
    FETCH_USER: 'Erro ao buscar usuário externo',
    CREATE_USER: 'Erro ao salvar novo instrutor',
    UPDATE_COURSE: 'Erro ao atualizar instrutores do curso',
    LESSONS_NOT_FOUND: 'Erro ao buscar aulas do instrutor',
    DELETE_COURSE: 'Erro ao deletar curso',
    OPERATION_FAILED: 'Ocorreu um erro na operação. Tente novamente.',
    DELETE_LESSON: 'Erro ao excluir aula. Tente novamente.',
  },
  SUCCESS: {
    REMOVE_INSTRUCTOR: 'Instrutor e suas aulas removidos com sucesso!',
    ADD_INSTRUCTOR: 'Novo instrutor adicionado com sucesso!',
    DELETE_COURSE: 'Curso deletado com sucesso!',
    CREATE_LESSON: 'Aula criada com sucesso!',
    UPDATE_LESSON: 'Aula atualizada com sucesso!',
    DELETE_LESSON: 'Aula excluída com sucesso!',
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
