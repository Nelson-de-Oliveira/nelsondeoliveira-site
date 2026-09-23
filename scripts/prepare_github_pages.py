#!/usr/bin/env python3
from pathlib import Path
import shutil
import re

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "_pages"

if DIST.exists():
    shutil.rmtree(DIST)

IGNORE = {".git", ".github", "_pages", "__pycache__"}

def copy_tree(src: Path, dst: Path):
    for item in src.iterdir():
        if item.name in IGNORE:
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
    relative = path.relative_to(DIST)
    prefix = "../" if len(relative.parts) > 1 else "./"
    text = re.sub(r'href="/+', f'href="{prefix}', text)
    text = re.sub(r'src="/+', f'src="{prefix}', text)
    text = re.sub(r'action="/+', f'action="{prefix}', text)
    path.write_text(text, encoding="utf-8")

print(f"GitHub Pages artifact preparado em {DIST}")
