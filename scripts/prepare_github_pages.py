#!/usr/bin/env python3
from pathlib import Path
import shutil
import re

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "_pages"

if DIST.exists():
    shutil.rmtree(DIST)

ignore = {".git", ".github", "_pages", "__pycache__"}

def copy_tree(src: Path, dst: Path):
    for item in src.iterdir():
        if item.name in ignore:
            continue
        target = dst / item.name
        if item.is_dir():
            target.mkdir(parents=True, exist_ok=True)
            copy_tree(item, target)
        else:
            shutil.copy2(item, target)

copy_tree(ROOT, DIST)

# GitHub Pages project sites live below /nelsondeoliveira-site/.
# Rewrite root-absolute HTML URLs to relative URLs in the published artifact.
for path in DIST.rglob("*.html"):
    text = path.read_text(encoding="utf-8", errors="replace")
    prefix = "../" if len(path.relative_to(DIST).parts) > 1 else "./"
    text = re.sub(r'href="/+', f'href="{prefix}', text)
    text = re.sub(r'src="/+', f'src="{prefix}', text)
    text = re.sub(r'action="/+', f'action="{prefix}', text)
    path.write_text(text, encoding="utf-8")

# The browser-side archive renderer generates links and fetch URLs itself.
# Make those URLs aware of the GitHub Pages project prefix while keeping
# Netlify/root hosting unchanged.
js_path = DIST / "assets" / "site-data.js"
js = js_path.read_text(encoding="utf-8")
if "const SITE_ROOT" not in js:
    js = js.replace(
        '(function(){\n  const DATA="/data/posts.json";\n  const THEMES="/data/themes.json";',
        '(function(){\n  const SITE_ROOT = location.hostname.endsWith(".github.io") ? "/nelsondeoliveira-site" : "";\n  const DATA=SITE_ROOT+"/data/posts.json";\n  const THEMES=SITE_ROOT+"/data/themes.json";\n  const siteUrl=p=>SITE_ROOT+p;'
    )
    js = js.replace('esc(p.url)', 'esc(siteUrl(p.url))')
    js = js.replace(
        "return '<a class="theme-card" href="/temas/'+esc(t.slug)+'.html">';",
        "return '<a class="theme-card" href="'+SITE_ROOT+'/temas/'+esc(t.slug)+'.html">';"
    )
    js = js.replace(
        "'/temas/'+esc(t.slug)+'.html",
        "''+SITE_ROOT+'/temas/'+esc(t.slug)+'.html"
    )
js_path.write_text(js, encoding="utf-8")

print(f"GitHub Pages artifact preparado em {DIST}")
