import os
from PIL import Image

source = r"C:\Users\hp\.gemini\antigravity\brain\9b516548-6f0f-4a43-8416-d639d7c022da\pwa_icon_large_1776703961343.png"
dest_dir = r"e:\ipl-pred\public"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

img = Image.open(source)

# 192x192
img.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, "pwa-192x192.png"))
# 512x512
img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, "pwa-512x512.png"))
# favicon
img.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, "favicon.ico"))

print("Icons generated successfully in public/")
