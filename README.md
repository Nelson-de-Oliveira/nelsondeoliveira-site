# Nelson de Oliveira — site

O GitHub é a fonte única do site. O Netlify publica automaticamente o conteúdo da branch `main`.

## Fluxo de trabalho

As alterações devem ser feitas no repositório. Não é necessário fazer deploy manual no Netlify.

Para uma nova publicação, o artigo entra em `posts/` e os índices do arquivo são actualizados de acordo com a estrutura do site.

Foi acrescentada uma verificação automática em GitHub Actions. Em cada alteração, o repositório verifica os links locais e a existência da pasta `posts/`. Se houver um link partido, a verificação falha e o problema pode ser corrigido antes de considerar a alteração concluída.

O conteúdo dos artigos deve permanecer separado da informação editorial e de navegação.
