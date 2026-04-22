import base64
import re
import os

# Paths
image_path = r'E:\Downloads\WhatsApp Image 2026-04-15 at 10.36.55 PM.jpeg'
html_path = r'e:\Downloads\kushi_magazine_A4.html'

def update_cover_image():
    # 1. Encode new image to base64
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return

    with open(image_path, 'rb') as img_file:
        img_data = img_file.read()
        base64_encoded = base64.b64encode(img_data).decode('utf-8')
    
    new_src = f"data:image/jpeg;base64,{base64_encoded}"

    # 2. Read HTML content
    print(f"Reading {html_path}...")
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # 3. Use regex to find and replace the src of the cover-img
    # Look for <img class="cover-img" (possibly other attributes) src="..."
    pattern = r'(<img[^>]*class="cover-img"[^>]*src=")([^"]*)(")'
    
    def replacer(match):
        print("Found cover-img tag, replacing src...")
        return match.group(1) + new_src + match.group(3)

    new_html_content, count = re.subn(pattern, replacer, html_content, flags=re.DOTALL)

    if count == 0:
        # Try finding by src if class order is different
        pattern = r'(<img[^>]*src=")([^"]*)([^>]*class="cover-img")'
        new_html_content, count = re.subn(pattern, lambda m: m.group(1) + new_src + m.group(3), html_content, flags=re.DOTALL)

    if count > 0:
        # 4. Write back the updated HTML
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_html_content)
        print(f"Successfully updated {count} cover image src(s).")
    else:
        print("Error: Could not find <img class=\"cover-img\" ... src=\"...\"> in the HTML.")

if __name__ == "__main__":
    update_cover_image()
