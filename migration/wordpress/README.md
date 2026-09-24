# Migração para WordPress.com

## Objectivo

Migrar o site editorial de Nelson de Oliveira para WordPress.com, deixando o GitHub/Netlify/Cloudflare fora do caminho da publicação diária.

## Fonte

- Repositório: `Nelson-de-Oliveira/nelsondeoliveira-site`
- Arquivo actual: 111 textos
- Livro: `A Educação em Tempos de Ruído` fica numa secção própria
- Publicações: secção própria, separada do arquivo histórico
- Diálogos e Evolução: eliminados
- O texto exacto `Centrauto` não deve regressar; `O mau exemplo da Centrauto` permanece.

## Importação

Foram preparados três ficheiros WXR compatíveis com o importador de WordPress:

1. `nelson-archive-01.xml` — 40 textos
2. `nelson-archive-02.xml` — 40 textos
3. `nelson-archive-03.xml` — 31 textos

Os ficheiros estão nesta pasta. A importação deve ser feita mantendo os slugs originais quando possível.

### Datas

Existem textos cuja data não pôde ser confirmada. Esses registos estão marcados com a meta `archive_date_status=unknown`. A data técnica usada no WXR é apenas um valor de importação; a apresentação pública deverá ocultar a data quando a data original é desconhecida.

## Estrutura pretendida

### Navegação principal

- Início
- Arquivo
- Temas
- Cronologia
- Essenciais
- Catálogo
- Livro
- Publicações
- Sobre

### Arquivo

111 textos históricos, preservados sem reescrita.

### Temas

- Política & democracia
- Educação
- Ambiente & consumo
- Empresas & liderança
- Pessoal
- Sociedade
- Desporto
- Cultura & música
- Direitos & cidadania
- Cultura & comunicação

### Páginas editoriais

- Livro — A Educação em Tempos de Ruído
- Publicações — textos recentes das redes sociais
- Sobre — autor e projecto
- Método — princípios do arquivo

## Visual

Manter a identidade actual:

- estética editorial contemporânea;
- fundo escuro azul/noite;
- texto claro;
- vermelho como cor de destaque;
- serif para títulos e leitura;
- sans-serif para navegação e metadados;
- espaço generoso;
- poucos elementos decorativos;
- navegação simples;
- leitura confortável em telemóvel.

## Fluxo futuro de publicação

Obsidian local:
`Site/Publicar/` + `site_publish: true`

→ revisão

→ publicar no WordPress.com

Depois da publicação, alterações simples podem ser feitas directamente no WordPress, sem GitHub e sem código.

## Infra-estrutura

Produção: WordPress.com.

O GitHub existente deve ser mantido apenas como arquivo/backup técnico durante a transição. Netlify, GitHub Pages e Cloudflare deixam de ser plataformas de produção quando a nova versão estiver validada.
