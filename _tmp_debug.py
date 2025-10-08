from pathlib import Path
text = Path('script.js').read_text(encoding='utf-8')
print(text[text.index('未命名'):text.index('未命名')+4])
