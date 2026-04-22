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

# 1. Page 12 container (Line 1183, index 1182)
update_line(1182, 'min-height:1123px', 'min-height:1123px;break-inside:avoid;page-break-inside:avoid;')

# 2. Childhood image height (Line 1208, index 1207)
update_line(1207, 'height:561px;', 'height:540px;')

# 3. Selfie image height (Line 1214, index 1213)
update_line(1213, 'height:560px;', 'height:540px;')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Finished applying updates to Page 12.")
