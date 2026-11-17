# Achei! — Achados e Perdidos da Escola

Projeto simples em HTML, CSS e JavaScript para executar no VS Code. Não possui tela de login.

## 1. Abrir no VS Code

1. Extraia o arquivo ZIP.
2. Abra o VS Code.
3. Vá em **File > Open Folder** e selecione a pasta `achei-site`.
4. Instale a extensão **Live Server** (Ritwick Dey).
5. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Não abra o HTML com duplo clique: use o Live Server para evitar problemas com o navegador.

## 2. Configurar o Supabase

1. Crie um projeto em https://supabase.com/.
2. No painel do projeto, abra **Project Settings > API** (ou **API Keys**, conforme a interface).
3. Copie a **Project URL** e a chave **anon/public**.
4. Abra `js/supabase.js`.
5. Substitua:
   - `COLE_AQUI_A_URL_DO_PROJETO` pela Project URL.
   - `COLE_AQUI_A_CHAVE_ANON_PUBLIC` pela chave anon/public.
6. No painel Supabase, abra **SQL Editor > New query**.
7. Copie todo o conteúdo de `supabase-setup.sql`, cole no editor e clique em **Run**.

A chave `anon/public` é feita para uso no navegador. Nunca coloque a `service_role` ou chave secreta no site.

## 3. Testar

1. Com o Live Server aberto, entre em **Achou algo perdido?**.
2. Cadastre uma foto, nome, categoria e local.
3. Abra **Perdeu algo?** para pesquisar o objeto.
4. Use **Marcar como devolvido** para removê-lo da lista de disponíveis.

A data e o horário são gerados automaticamente pelo banco de dados no momento da publicação.

## 4. Observações importantes

- O Supabase tem plano gratuito sujeito a limites e condições.
- Como não há login, qualquer visitante pode publicar e marcar objetos como devolvidos. Isso é intencional para a demonstração, mas permite spam e alterações indevidas.
- Para apresentar na escola, combine com o professor/responsável quem poderá moderar os registros. Não publique documentos, dados pessoais, contatos, imagens de pessoas ou objetos que possam expor alguém.
- As políticas do SQL permitem acesso público ao bucket de fotos. A política de exclusão está incluída para facilitar a limpeza de uploads, mas a interface não oferece exclusão de fotos.
- Este é um protótipo escolar. Para uso real, é recomendável adicionar moderação, limites de publicação e regras de autorização mais restritas.
