
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir os arquivos do portfólio
app.use(express.static(__dirname, {
    index: 'index.html',
    dotfiles: 'deny'
}));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
