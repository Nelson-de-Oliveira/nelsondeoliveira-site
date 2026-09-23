# Obsidian → GitHub → Site

## Princípio

O vault do Obsidian deve ser sincronizado para um **repositório GitHub privado**. O site público continua separado em nelsondeoliveira-site.

Nunca sincronizar o vault inteiro para o repositório público.

## Duas portas de controlo

Uma nota só é candidata a publicação quando:

1. está numa pasta de publicação seleccionada;
2. tem site_publish: true no frontmatter.

Exemplo:

~~~yaml
---
site_publish: true
site_section: social
platform: Facebook
date: 2026-09-23
title: "Título da publicação"
url: "https://..."
---
~~~

Para o livro:

~~~yaml
---
site_publish: true
site_section: book
title: "Como nasceu uma ideia"
---
~~~

## Estrutura recomendada no vault

~~~
Vault/
├── 00 Inbox/
├── 01 Notas/
├── 02 Projetos/
├── Site/
│   ├── Publicar/
│   │   ├── Social/
│   │   ├── Livro/
│   │   └── Arquivo/
│   └── Rascunhos/
└── ...
~~~

O que estiver fora de Site/Publicar/ nunca deve ser enviado para o site.

## Sincronização privada

Criar no GitHub um repositório **privado**, por exemplo:

Nelson-de-Oliveira/nelson-vault

No computador, dentro da pasta do vault:

~~~powershell
git init
git branch -M main
git remote add origin https://github.com/Nelson-de-Oliveira/nelson-vault.git
git add .
git commit -m "Backup inicial do vault"
git push -u origin main
~~~

Antes do primeiro git add ., criar um .gitignore para impedir que lixo local do Obsidian seja enviado.

## Plugin Obsidian

No Obsidian, o plugin **Git** é a opção mais consolidada e permite commit, pull, push, histórico e controlo de ficheiros directamente no vault.

Para o primeiro momento, manter o sync privado e separar a publicação do site. O mecanismo de publicação pode ser manual no início e automatizado depois.

## Regra de segurança

O repositório do vault é privado.

O repositório nelsondeoliveira-site é público.

Nunca colocar no repositório público:
- notas pessoais;
- rascunhos;
- credenciais;
- tokens;
- ficheiros privados;
- notas que não tenham site_publish: true.

## Processo de publicação

Escrever no Obsidian → rever → activar site_publish: true → exportar apenas as notas aprovadas → actualizar nelsondeoliveira-site → GitHub Actions valida e publica.

Assim, **sincronizar o vault não significa publicar**.

## Próxima fase

A automação final deverá ler as notas aprovadas e gerar:
- publicações sociais;
- páginas do livro;
- artigos do arquivo, quando aplicável;
- índices e sitemap.

Sem intervenção manual na estrutura HTML do site.
