
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
);

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Sessões temporárias armazenadas no servidor
const sessoes = new Map();

const paginasProtegidas = [
    'home.html',
    'informacoes.html',
    'eixos.html',
    'curriculo.html',
    'anexos.html'
];

function criarCookie(res, id) {
    res.cookie('sessao_portfolio', id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    });
}

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha o e-mail e a senha.'
        });
    }

    try {
        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password: senha
            });

        if (error || !data.session) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        const id = crypto.randomUUID();

        sessoes.set(id, {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token
        });

        criarCookie(res, id);

        return res.json({
            sucesso: true,
            mensagem: 'Acesso autorizado!',
            usuario: {
                email: data.user.email
            }
        });

    } catch (erro) {
        console.error('Erro no login:', erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao conectar ao sistema.'
        });
    }
});

// VERIFICAÇÃO DA SESSÃO
async function verificarSessao(req, res, next) {
    const id = req.cookies?.sessao_portfolio;
    const sessao = sessoes.get(id);

    if (!sessao) {
        return res.redirect('/index.html');
    }

    try {
        let { data, error } = await supabase.auth.getUser(
            sessao.accessToken
        );

        // Se o token expirou, tenta renovar a sessão
        if (error) {
            const renovacao = await supabase.auth.refreshSession({
                refresh_token: sessao.refreshToken
            });

            if (renovacao.error || !renovacao.data.session) {
                sessoes.delete(id);
                res.clearCookie('sessao_portfolio', { path: '/' });
                return res.redirect('/index.html');
            }

            sessao.accessToken =
                renovacao.data.session.access_token;

            sessao.refreshToken =
                renovacao.data.session.refresh_token;

            sessoes.set(id, sessao);

            data = { user: renovacao.data.user };
        }

        req.usuario = data.user;
        next();

    } catch (erro) {
        console.error('Erro ao verificar sessão:', erro);
        return res.redirect('/index.html');
    }
}

// SAIR
app.post('/api/logout', (req, res) => {
    const id = req.cookies?.sessao_portfolio;

    if (id) {
        sessoes.delete(id);
    }

    res.clearCookie('sessao_portfolio', { path: '/' });

    return res.json({
        sucesso: true,
        mensagem: 'Sessão encerrada.'
    });
});

// Ler cookies sem instalar outro pacote
app.use((req, res, next) => {
    const cookies = req.headers.cookie || '';

    req.cookies = {};

    cookies.split(';').forEach(cookie => {
        const partes = cookie.trim().split('=');

        if (partes.length >= 2) {
            req.cookies[partes[0]] =
                decodeURIComponent(partes.slice(1).join('='));
        }
    });

    next();
});

app.use(express.json());


// Liberar a página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Proteger todas as páginas internas
app.use((req, res, next) => {
    const arquivo = path.basename(req.path);

    if (req.path.toLowerCase().endsWith('.html')) {
        if (paginasProtegidas.includes(arquivo)) {
            return verificarSessao(req, res, next);
        }

        if (arquivo !== 'index.html') {
            return res.sendStatus(404);
        }
    }

    next();
});

// Bloquear arquivos internos do projeto
app.use((req, res, next) => {
    const proibidos = [
        'server.js',
        'package.json',
        'package-lock.json',
        '.env',
        '.gitignore'
    ];

    const arquivo = path.basename(req.path);

    if (
        proibidos.includes(arquivo) ||
        req.path.includes('/node_modules/') ||
        req.path.includes('/.git/')
    ) {
        return res.sendStatus(404);
    }

    next();
});

// Entregar CSS, imagens, JS e demais arquivos públicos
app.use(express.static(__dirname, {
    index: false,
    dotfiles: 'deny'
}));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
