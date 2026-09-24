# Fluxo Obsidian → WordPress.com

## Objectivo

Escrever no Obsidian e publicar deliberadamente no WordPress.com sem GitHub Actions, Netlify ou Cloudflare no caminho da publicação.

## Estrutura

```
M@bus/
└── Site/
    ├── Publicar/
    │   ├── Artigos/
    │   ├── Social/
    │   └── Livro/
    └── Rascunhos/
```

Tudo o que estiver fora de `Site/Publicar/` permanece privado.

## Frontmatter sugerido

### Artigo

```yaml
---
site_publish: true
site_section: archive
title: "Título do artigo"
category: "Educação"
tags:
  - educação
  - sociedade
---
```

### Publicação actual

```yaml
---
site_publish: true
site_section: social
platform: Facebook
title: "Título da publicação"
date: 2026-09-24
url: "https://..."
---
```

## Regra operacional

1. Escrever normalmente no Obsidian.
2. Rever.
3. Mover para `Site/Publicar/` ou colocar `site_publish: true`.
4. Executar a acção de publicação para WordPress.
5. O conteúdo entra como rascunho, permitindo revisão.
6. Publicar directamente no WordPress quando estiver pronto.

## Plugin Obsidian

O plugin da comunidade **Publish to WordPress** permite publicar a nota activa como rascunho no WordPress através da REST API, usando Application Passwords. Também converte Markdown para HTML e pode usar uma imagem destacada definida no frontmatter.

Alternativa com mais funções editoriais: **Writing Studio**, que inclui publicação WordPress e permite escolher rascunho, revisão ou publicação, categorias, tags, excerto e data agendada.

## Princípio de segurança

Nunca usar sincronização automática de toda a vault para o site público.

O vault continua a ser privado. A publicação é sempre uma decisão explícita.
