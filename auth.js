
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error || !data.session) {
            window.location.replace('index.html');
            return;
        }

    } catch (erro) {
        console.error('Erro ao verificar autenticação:', erro);
        window.location.replace('index.html');
    }
});
