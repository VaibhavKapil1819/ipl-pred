import sys

file_path = r'e:\Downloads\kushi_magazine_A4.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def update_line(idx, target, replacement):
    if idx < len(lines):
        if target in lines[idx]:
            lines[idx] = lines[idx].replace(target, replacement)
            print(f"Updated line {idx + 1}")
            return True
        else:
            print(f"Mismatch at line {idx + 1}: expected '{target.strip()[:50]}...', found '{lines[idx].strip()[:50]}...'")
    return False

# 1. Global line height (Line 487, index 486)
update_line(486, 'line-height: 2;', 'line-height: 1.7;')

# 2. Page 7 min-height (Line 969, index 968)
update_line(968, 'min-height:1123px', 'min-height:1080px')

# 3. Poem padding (Line 970, index 969)
update_line(969, '<div class="poem-light">', '<div class="poem-light" style="padding: 30px 60px">')

# 4. Image grid flex (Line 988, index 987)
update_line(987, 'style="flex:1;', 'style="')

# 5. Image min-heights (Lines 991, 996 -> indices 990, 995)
update_line(990, 'min-height:350px;', 'min-height:280px;')
update_line(995, 'min-height:350px;', 'min-height:280px;')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Finished applying revised fixes.")
