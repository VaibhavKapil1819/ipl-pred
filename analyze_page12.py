import re
import sys

file_path = r'e:\Downloads\kushi_magazine_A4.html'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = 1180
end = 1250

pattern = re.compile(r'data:image/.+?;base64,[^"\'\s]+')

for i in range(start - 1, min(end, len(lines))):
    line = lines[i].strip()
    # Replace long base64 strings with a placeholder
    display_line = pattern.sub("[BASE64]", line)
    # Handle encoding for Windows console
    safe_line = display_line.encode('ascii', errors='replace').decode('ascii')
    print(f"{i+1}: {safe_line}")
