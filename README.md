# Petflow - Sistema de Gerenciamento de Petshop

Este projeto é a entrega da **Sprint 4** da disciplina de Laboratório de Engenharia de Software.

| Aluno | Lucas Bastos Palmaccio |
| :--- | :--- |
| Professor | Carlos Verissimo |
| Disciplina | Laboratório de Engenharia de Software |
| Curso | Análise e Desenvolvimento de Sistemas |
| Semestre | 2025/2 |

-----

## 1\. Visão Geral da Arquitetura

O projeto utiliza uma arquitetura de cliente-servidor:

* **`petflow-api` (Back-end):** Uma API RESTful robusta desenvolvida em **Java 21 com Spring Boot 3**. Ela gerencia toda a lógica de negócio, autenticação (Spring Security) e persistência de dados.
* **`petflow-web` (Front-end):** Uma SPA (Single Page Application) desenvolvida em **Angular 18+** e **TypeScript**, responsável pela interface do administrador e do cliente.
* **Banco de Dados:** **PostgreSQL**, provisionado via Docker.
* **Ambiente:** O projeto é totalmente containerizado com **Docker e Docker Compose** para garantir a facilidade nos testes.

-----

## 2\. 🚀 Sprint 4: O que foi Entregue (12/11/2025)

O objetivo desta Sprint foi implementar as funcionalidades de **controle e análise gerencial**.

* **UC06 - Controlar Estoque:**

    * Foi implementada a lógica de **baixa automática de estoque**.
    * Quando um **Agendamento** é marcado como **"Concluído"**, o sistema agora verifica todos os `Servicos` associados a ele.
    * Para cada `Servico`, o sistema consulta a tabela `ServicoProduto` (tabela associativa) para saber quais `Produtos` e em qual `Quantidade` são utilizados.
    * O `ProdutoService` é então acionado para subtrair a quantidade utilizada do `qtdEstoque` no banco de dados.

* **Dashboard Financeiro:**

    * O back-end agora possui um endpoint que calcula o faturamento total com base em todos os agendamentos com status **"CONCLUIDO"**.
    * O front-end exibe este valor em um card principal no Dashboard, fornecendo ao administrador uma visão clara da receita.

-----

## 3\. ⚙️ Como Executar a Aplicação (Instruções para Teste)

O projeto é 100% containerizado. O professor só precisa do Docker instalado.

### Pré-requisitos

* **Docker Desktop** (ou Docker Engine + Docker Compose)

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/lucaspalmaccio/petflow-tcc.git
cd petflow-tcc
```

### Passo 2: Executar a Aplicação (Um Comando)

Navegue até a pasta raiz do projeto (onde o arquivo `docker-compose.yml` está localizado) e execute:

```bash
docker-compose up --build
```

Este comando fará tudo automaticamente:

1.  Construirá a imagem do back-end (`petflow-api`), **compilando o código Java**.
2.  Construirá a imagem do front-end (`petflow-web`), **compilando o código Angular**.
3.  Iniciará os 3 containers (`db`, `api`, `web`) na ordem correta.

Aguarde os logs se estabilizarem.

### Passo 3: Acessar a Aplicação

Abra seu navegador e acesse:
**`http://localhost:81/`**

*(Obs: A API estará disponível em `http://localhost:8081` e o banco na porta `5432`)*

-----

## 4\. 🔑 IMPORTANTE: Criando o Usuário Administrador

Por padrão, o banco de dados é iniciado **vazio** (sem nenhum usuário). Para testar as funcionalidades administrativas, você precisará **criar um usuário e promovê-lo a ADMIN**.

Siga estes 3 passos:

### Passo 1: Cadastre-se no Site

1.  Acesse o site: **`http://localhost:81`**
2.  Clique em "Cadastrar" e crie um novo usuário.
    * *Exemplo: `admin@teste.com` | Senha: `123456`*
3.  Neste momento, este usuário é apenas um `CLIENTE`.

### Passo 2: Promova o Usuário a ADMIN

1.  **Abra um novo terminal** (mantenha o `docker-compose up` rodando no primeiro).

2.  Execute o comando abaixo na pasta raiz do projeto, **substituindo o e-mail** pelo que você acabou de cadastrar:

    ```bash
    docker-compose exec db psql -U postgres -d petflow_db -c "UPDATE usuarios SET perfil = 'ADMIN' WHERE email = 'seu-email-aqui@teste.com';"
    ```

3.  O terminal deve retornar `UPDATE 1`.

### Passo 3: Faça Login

Pronto\! Agora, faça login no site (`http://localhost:81`) com o usuário e senha que você criou. O sistema irá reconhecê-lo como **ADMIN** e você terá acesso a todas as funcionalidades.

-----

## 5\. Fluxo de Teste Sugerido (Validando a Sprint 4)

1.  **Login:** Acesse o sistema como **Administrador** (usando o usuário criado no passo 4).
2.  **(Setup)** Vá para a tela **"Produtos"** e cadastre um produto (ex: "Shampoo", Estoque: 100).
3.  **(Setup)** Vá para a tela **"Serviços"** e cadastre um serviço (ex: "Banho"), associando a ele o uso de **1** unidade do "Shampoo".
4.  **Criar Agendamento:** Crie um novo agendamento (Sprint 3) para um cliente, utilizando o serviço "Banho".
5.  **Testar Baixa de Estoque (UC06):**
    * Na tela da agenda ou dashboard, localize o agendamento criado e clique em **"Concluir"**.
    * Vá para a tela **"Produtos"**.
    * **Verifique:** O estoque de "Shampoo" deve ter sido atualizado de 100 para **99**.
6.  **Testar Dashboard Financeiro:**
    * Vá para o **"Dashboard"**.
    * **Verifique:** O card "Faturamento Total" deve agora mostrar o valor do serviço "Banho" que foi concluído.