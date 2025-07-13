# SphereCourse - Sua Plataforma de Gerenciamento de Cursos

Bem-vindo ao projeto SphereCourse! Esta é uma aplicação web para gerenciar cursos, com funcionalidades de visualização, filtragem e autenticação de usuários.

## Começando

Siga as instruções abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados em sua máquina.

- **Node.js**: [Download e Instalação](https://nodejs.org/en/download/)
- **npm**: Vem com o Node.js.

### Instalação

1.  **Clone o repositório** (se ainda não o fez):

    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd SphereCourse
    ```

2.  **Instale as dependências:**
    Navegue até o diretório raiz do projeto e execute o comando para instalar todas as dependências necessárias:
    ```bash
    npm install
    ```

### Executando o Projeto

O projeto consiste em duas partes principais: um servidor JSON (para simular a API) e a aplicação React.

1.  **Iniciar o Servidor JSON (API Mock):**
    Abra um novo terminal na raiz do projeto e execute o comando para subir o servidor JSON. Este servidor simula as requisições de API para o frontend.

    ```bash
    npm run server
    ```

    Este comando iniciará o servidor JSON geralmente em `http://localhost:3001`.

2.  **Iniciar a Aplicação Web (Frontend):**
    Abra _outro_ novo terminal na raiz do projeto e execute o comando para iniciar a aplicação React:
    ```bash
    npm run dev
    ```
    Este comando iniciará a aplicação de desenvolvimento, que geralmente estará disponível em `http://localhost:5173` (ou uma porta similar, dependendo da sua configuração).

## Acessando a Aplicação

Após seguir os passos acima, sua aplicação estará rodando no navegador.

### Informações de Login

Para testar a aplicação, você pode fazer login com as seguintes credenciais de exemplo:

- **Email:** `giovanny@gmail.com`
- **Senha:** `kojismo`

### Como Testar as Funcionalidades

Após o login, você será direcionado para o painel de controle. Para testar as funcionalidades de listagem e filtro de cursos, utilize o card de curso denominado "**Introdução à lógica computacional**". Você pode tentar filtrá-lo ou observar como ele aparece na lista lá terá um curso com ulas preenchidas pra testar s funcionalidades, Caso deseje retornar para o dashboard clique em CourseSphere ou no avatar.
