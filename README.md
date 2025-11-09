# Petflow - Sistema de Gerenciamento de Petshop

Este projeto é a entrega da **Sprint 4** da disciplina de Laboratório de Engenharia de Software.

| Aluno | Lucas Bastos Palmaccio                         |
| :--- |:-----------------------------------------------|
| Professor | Carlos Verissimo                               |
| Disciplina | Laboratório de Engenharia de Software          |
| Curso | Análise e Desenvolvimento de Sistemas          |
| Semestre | 2025/2                                         |

---

## 1. Visão Geral da Arquitetura

O projeto utiliza uma arquitetura de cliente-servidor:
* **`petflow-api` (Back-end):** Uma API RESTful robusta desenvolvida em **Java 21 com Spring Boot 3**. Ela gerencia toda a lógica de negócio, autenticação (Spring Security) e persistência de dados. 
* **`petflow-web` (Front-end):** Uma SPA (Single Page Application) desenvolvida em **Angular 18+** e **TypeScript**, responsável pela interface do administrador e do cliente. 
* **Banco de Dados:** **PostgreSQL**, provisionado via Docker. 
* **Ambiente:** O projeto é totalmente containerizado com **Docker e Docker Compose** para garantir a facilidade nos testes.

---

## 2. 🚀 Sprint 4: O que foi Entregue (12/11/2025)

O objetivo desta Sprint foi implementar as funcionalidades de **controle e análise gerencial**.

* **UC06 - Controlar Estoque:**
    * Foi implementada a lógica de **baixa automática de estoque**.
    * Quando um **Agendamento** é marcado como **"Concluído"**, o sistema agora verifica todos os `Servicos` associados a ele.
    * Para cada `Servico`, o sistema consulta a tabela `ServicoProduto` (tabela associativa) para saber quais `Produtos` e em qual `Quantidade` são utilizados.
    * O `ProdutoService` é então acionado para subtrair a quantidade utilizada do `qtdEstoque` no banco de dados. 

* **Dashboard Financeiro:**
    * O back-end agora possui um endpoint que calcula o faturamento total com base em todos os agendamentos com status **"CONCLUIDO"**. 
    * O front-end exibe este valor em um card principal no Dashboard, fornecendo ao administrador uma visão clara da receita.

---

## 3. ⚙️ Como Executar a Aplicação (Instruções para Teste)

Para testar a aplicação, siga estes 3 passos. O Docker Compose gerenciará o back-end e o banco de dados.

### Pré-requisitos

* Docker Desktop (ou Docker Engine + Docker Compose)
* Node.js 18+ (e NPM)

### Passo 1: Clonar o Repositório

```bash
git clone [https://github.com/lucaspalmaccio/petflow-tcc.git](https://github.com/lucaspalmaccio/petflow-tcc.git)
cd petflow-tcc
```

### Passo 2: Executar o Back-end e o Banco de Dados (Docker)

1.  **Navegue até a pasta da API:**
    ```bash
    cd petflow-api
    ```

2.  **(IMPORTANTE) Empacotar a Aplicação Java:**
    O Docker precisa do arquivo `.jar` compilado. Execute o comando do Maven para criá-lo:
    ```bash
    mvn clean package
    ```

3.  **Suba os Contêineres:**
    (Ainda na pasta `petflow-api`, onde o `docker-compose.yml` está localizado)
    ```bash
    docker-compose up --build
    ```
    Aguarde até que o `postgres-db` esteja pronto e o `petflow-api` mostre a mensagem:
    **`... Started PetflowApplication in X.XXX seconds`**

    O back-end agora está rodando na porta `http://localhost:8081`.

### Passo 3: Executar o Front-end (NPM)

1.  **Abra um NOVO terminal.**
2.  **Navegue até a pasta do front-end:**
    ```bash
    # (A partir da raiz do projeto petflow-tcc)
    cd petflow-web
    ```

3.  **Instale as dependências (apenas na primeira vez):**
    ```bash
    npm install
    ```

4.  **Inicie o servidor do Angular:**
    ```bash
    ng serve
    ```

### Passo 4: Acessar a Aplicação

Abra seu navegador e acesse:
**`http://localhost:4200/`**

---

## 4. Fluxo de Teste Sugerido (Validando a Sprint 4)

1.  **Login:** Acesse o sistema como **Administrador**.
2.  **(Setup)** Vá para a tela **"Produtos"** e cadastre um produto (ex: "Shampoo", Estoque: 100).
3.  **(Setup)** Vá para a tela **"Serviços"** e cadastre um serviço (ex: "Banho"), associando a ele o uso de **1** unidade do "Shampoo".
4.  **Criar Agendamento:** Crie um novo agendamento (Sprint 3) para um cliente, utilizando o serviço "Banho".
5.  **Testar Baixa de Estoque (UC06):**
    * Na tela da agenda ou dashboard, localize o agendamento criado e clique em **"Concluir"**.
    * Vá para a tela **"Produtos"**.
    * **Verifique:** O estoque de "Shampoo" deve ter sido atualizado de 100 para **99**. 
    * **Testar Dashboard Financeiro:**
    * Vá para o **"Dashboard"**.
    * **Verifique:** O card "Faturamento Total" deve agora mostrar o valor do serviço "Banho" que foi concluído. 