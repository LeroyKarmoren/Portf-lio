const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'sistema_login'
});

conexao.connect((erro) => {
    if (erro) {
        console.log('Erro ao conectar:', erro);
    } else {
        console.log('Banco conectado!');
    }
});

// Rota de login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha o e-mail e a senha.'
        });
    }

    const sql = `
        SELECT id, email
        FROM usuarios
        WHERE email = ? AND senha = ?
    `;

    conexao.query(sql, [email, senha], (erro, resultados) => {
        if (erro) {
            console.log(erro);
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao consultar o banco.'
            });
        }

        if (resultados.length > 0) {
            return res.json({
                sucesso: true,
                mensagem: 'Acesso autorizado!',
                usuario: resultados[0]
            });
        }

        return res.status(401).json({
            sucesso: false,
            mensagem: 'E-mail ou senha incorretos.'
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});