#!/usr/bin/env python3
from pathlib import Path
import json, re, html

ROOT = Path(__file__).resolve().parents[1]
POSTS_DIR = ROOT / "posts"
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

def clean(s):
    s = re.sub(r"<script\b[^>]*>.*?</script>", " ", s, flags=re.I|re.S)
    s = re.sub(r"<style\b[^>]*>.*?</style>", " ", s, flags=re.I|re.S)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()

def first(pattern, text):
    m = re.search(pattern, text, re.I|re.S)
    return clean(m.group(1)) if m else ""

themes_path = DATA_DIR / "themes.json"
themes = json.loads(themes_path.read_text(encoding="utf-8")) if themes_path.exists() else []

# Existing manual theme assignment is preserved. New posts may also declare:
# <meta name="article:theme" content="slug">
theme_map = {}
for theme in themes:
    for url in theme.get("urls", []):
        theme_map.setdefault(url, []).append(theme["slug"])

records = []
for path in sorted(POSTS_DIR.glob("*.html")):
    text = path.read_text(encoding="utf-8", errors="replace")
    title = first(r"<h1[^>]*>(.*?)</h1>", text) or path.stem
    date = first(r'"datePublished"\s*:\s*"([^"]+)"', text)
    if not date:
        date = first(r'<div class="article-meta"[^>]*>(\d{4}-\d{2}-\d{2})</div>', text)
    if not date:
        candidates = re.findall(r"\b(?:19|20)\d{2}-\d{2}-\d{2}\b", text)
        date = candidates[0] if candidates else ""
    category = first(r'<div class="kicker"[^>]*>(.*?)</div>', text)
    article_theme = first(r'<meta[^>]+name=["\']article:theme["\'][^>]+content=["\']([^"\']+)["\']', text)
    article_type = first(r'<meta[^>]+name=["\']article:type["\'][^>]+content=["\']([^"\']+)["\']', text)
    url = "/posts/" + path.name
    slugs = list(theme_map.get(url, []))
    if article_theme and article_theme not in slugs:
        slugs.append(article_theme)

    article = re.search(r"<article\b[^>]*>(.*?)</article>", text, re.I|re.S)
    body = clean(article.group(1) if article else text)
    for prefix in (title, category, date):
        if prefix:
            body = re.sub(r"^\s*" + re.escape(prefix) + r"\s*", "", body, flags=re.I)
    excerpt = body[:260].rsplit(" ", 1)[0] + "…" if len(body) > 260 else body

    records.append({
        "title": title,
        "date": date,
        "url": url,
        "text": body,
        "excerpt": excerpt,
        "category": category,
        "themes": slugs,
        "type": article_type
    })

DATA_DIR.joinpath("posts.json").write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
# Compatibility copy for older URLs/tools.
ROOT.joinpath("pesquisa.json").write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Gerados {len(records)} registos.")
