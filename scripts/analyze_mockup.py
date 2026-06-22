"""Analyze mockup images for Prompt Enhancer feature."""
import base64
import sys

# Read the enhancer mockup
with open(r'C:\Users\uzinh\Downloads\prompt-enhancer.png', 'rb') as f:
    data = f.read()
b64 = base64.b64encode(data).decode()
# Print just the first 300 chars to identify it
print(f"File size: {len(data)} bytes")
print(f"Base64 preview: {b64[:200]}...")
