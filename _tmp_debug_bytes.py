from pathlib import Path
text = Path('script.js', encoding='utf-8').read_bytes()
start = text.find('\xe6\x9c\xaa'.encode('latin1'))
print(start)
