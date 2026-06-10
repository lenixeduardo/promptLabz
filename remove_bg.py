#!/usr/bin/env python3
"""
Remove background from mascot crop images, saving as PNGs with transparency.
Uses flood-fill from corners with color-tolerance (works for white AND mint-green backgrounds).
"""

from PIL import Image, ImageFilter
import numpy as np
from collections import deque

ASSETS = "/home/user/promptLab/public/assets"


def color_distance(pixel, ref_color):
    """Euclidean distance in RGB space."""
    return np.sqrt(sum((int(pixel[i]) - int(ref_color[i])) ** 2 for i in range(3)))


def sample_bg_color(arr, n=5):
    """
    Sample the background color from the image corners/edges.
    Returns the mean RGB of likely-background pixels.
    """
    h, w = arr.shape[:2]
    samples = []
    # Corners
    for y, x in [(0,0),(0,w-1),(h-1,0),(h-1,w-1)]:
        samples.append(arr[y, x, :3])
    # Edge midpoints
    for y, x in [(0, w//2), (h-1, w//2), (h//2, 0), (h//2, w-1)]:
        samples.append(arr[y, x, :3])
    return np.mean(samples, axis=0)


def flood_fill_bg_mask(arr, tolerance=30):
    """
    Build a background mask by flood-filling from all border pixels.
    Seeds from ALL border pixels, not just corners — more robust.
    Tolerance: max color distance from the seed pixel to count as background.
    """
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(float)

    # Sample background color from corners
    bg_color = sample_bg_color(arr)
    print(f"    Detected bg color: RGB({bg_color[0]:.0f},{bg_color[1]:.0f},{bg_color[2]:.0f})")

    # Pre-compute which pixels are "close to background color"
    diff = np.linalg.norm(rgb - bg_color, axis=2)
    potentially_bg = diff < tolerance

    visited = np.zeros((h, w), dtype=bool)
    queue = deque()

    # Seed from entire border
    for x in range(w):
        if potentially_bg[0, x] and not visited[0, x]:
            visited[0, x] = True
            queue.append((0, x))
        if potentially_bg[h-1, x] and not visited[h-1, x]:
            visited[h-1, x] = True
            queue.append((h-1, x))
    for y in range(1, h-1):
        if potentially_bg[y, 0] and not visited[y, 0]:
            visited[y, 0] = True
            queue.append((y, 0))
        if potentially_bg[y, w-1] and not visited[y, w-1]:
            visited[y, w-1] = True
            queue.append((y, w-1))

    # BFS
    while queue:
        y, x = queue.popleft()
        for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
            ny, nx = y+dy, x+dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and potentially_bg[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))

    return visited  # True = background


def remove_background(img, tolerance=30, feather_px=2):
    """
    Remove background using flood-fill from border + optional edge feathering.
    tolerance: color distance threshold for "same as background"
    """
    img_rgba = img.convert("RGBA")
    data = np.array(img_rgba, dtype=np.uint8)

    bg_mask = flood_fill_bg_mask(data, tolerance=tolerance)

    # Build alpha: 0 for background, 255 for foreground
    alpha = np.where(bg_mask, 0, 255).astype(np.uint8)

    # Feather edges: blur the alpha mask, then blend only at transition zone
    if feather_px > 0:
        alpha_img = Image.fromarray(alpha, "L")
        blurred = alpha_img.filter(ImageFilter.GaussianBlur(radius=feather_px))
        blurred_arr = np.array(blurred)
        # Only soften pixels that were foreground but near the edge
        edge_zone = (alpha == 255) & (blurred_arr < 220)
        alpha[edge_zone] = blurred_arr[edge_zone]

    out = data.copy()
    out[:, :, 3] = alpha
    return Image.fromarray(out, "RGBA")


def crop_and_save(src_path, box, out_path, tolerance=30, feather_px=2):
    """
    Crop a region from src_path, remove background, save as transparent PNG.
    """
    print(f"\nProcessing: {out_path.split('/')[-1]}")
    src = Image.open(src_path).convert("RGB")
    cropped = src.crop(box)
    print(f"  Crop {box} -> {cropped.size}")
    result = remove_background(cropped, tolerance=tolerance, feather_px=feather_px)
    result.save(out_path, "PNG")

    # Quality check
    arr = np.array(result)
    alpha = arr[:, :, 3]
    total = alpha.size
    transparent_pct = (alpha == 0).sum() / total * 100
    opaque_pct = (alpha == 255).sum() / total * 100
    corners = [alpha[0,0], alpha[0,-1], alpha[-1,0], alpha[-1,-1]]
    print(f"  transparent={transparent_pct:.1f}%  opaque={opaque_pct:.1f}%")
    print(f"  corner alphas: {[int(c) for c in corners]}")

    import os
    sz = os.path.getsize(out_path)
    print(f"  Saved {result.size} — {sz} bytes")
    return result


def main():
    login_src = f"{ASSETS}/login-wireframe.jpeg"
    home_src  = f"{ASSETS}/home-wireframe.jpeg"

    tasks = [
        # (src, box, out_path, tolerance)
        (login_src, (250,  70,  740,  470), f"{ASSETS}/mascot-login.png",  35),
        (home_src,  (930, 205, 1179,  645), f"{ASSETS}/mascot-home.png",   40),
        (login_src, (300,  70,  690,  470), f"{ASSETS}/mascot-learn.png",  35),
        (login_src, (882, 1838, 1130, 2046),f"{ASSETS}/help-cat.png",      40),
        (home_src,  (1048, 34, 1126,  112), f"{ASSETS}/avatar-cat.png",    40),
    ]

    for src, box, out, tol in tasks:
        crop_and_save(src, box, out, tolerance=tol, feather_px=2)

    print("\n--- Summary ---")
    for _, _, out, _ in tasks:
        import os
        if os.path.exists(out):
            img = Image.open(out)
            sz = os.path.getsize(out)
            name = out.split("/")[-1]
            print(f"  {name}  {img.size}  {sz:,} bytes  OK")
        else:
            print(f"  MISSING: {out}")


if __name__ == "__main__":
    main()
