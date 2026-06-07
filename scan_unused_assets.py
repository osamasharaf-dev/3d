import re
from pathlib import Path
root = Path(r'c:/Users/osama/Downloads/3d/3d/src')
assets_index = root / 'assets' / 'index.js'
text = assets_index.read_text(encoding='utf-8')
imports = re.findall(r'import\s+(\w+)\s+from\s+"[^"]+";', text)
source_files = [p for p in root.rglob('*.js') if p != assets_index]
unused = []
for name in imports:
    pattern = re.compile(r'\b' + re.escape(name) + r'\b')
    if not any(pattern.search(p.read_text(encoding='utf-8')) for p in source_files):
        unused.append(name)
print('unused_imports:', unused)
print('count imports', len(imports))
