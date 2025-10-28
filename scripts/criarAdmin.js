const bcrypt = require('bcrypt');
const { Client } = require('pg');

// Configurações do banco de dados
const client = new Client({
  host: 'localhost',       // host do PostgreSQL
  port: 5432,              // porta padrão
  user: 'postgres',        // usuário
  password: 'senha',       // senha
  database: 'petflow_db'   // nome do banco
});

// Dados do novo admin
const email = 'novoadmin@petflow.com';
const nome = 'Admin Novo';
const role = 'ADMIN';
const senha = '123456'; // senha em texto

// Gera o hash da senha
const saltRounds = 10;
const hashSenha = bcrypt.hashSync(senha, saltRounds);

console.log('Hash gerado:', hashSenha);

// Conecta ao banco e insere o novo admin
(async () => {
  try {
    await client.connect();

    // Verifica se o e-mail já existe
    const resCheck = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (resCheck.rows.length > 0) {
      console.log('Erro: e-mail já cadastrado.');
      return;
    }

    const sql = `INSERT INTO usuarios (email, nome, role, senha_hash)
                 VALUES ($1, $2, $3, $4) RETURNING id`;

    const res = await client.query(sql, [email, nome, role, hashSenha]);
    console.log('Admin criado com sucesso! ID:', res.rows[0].id);

  } catch (err) {
    console.error('Erro ao criar admin:', err);
  } finally {
    await client.end();
  }
})();
