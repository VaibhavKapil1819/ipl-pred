import base64
import os

img_path = r"E:\Downloads\WhatsApp Image 2026-04-15 at 10.36.55 PM.jpeg"
with open(img_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    print(encoded_string)
