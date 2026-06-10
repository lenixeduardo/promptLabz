#!/usr/bin/env python3
"""
Remove background from mascot crop images, saving as PNGs with transparency.
Uses multi-seed flood-fill to handle images with mixed backgrounds (white + mint green).
"""

from PIL import Image, ImageFilter
import numpy as np
from collections import deque

ASSETS = "/home/user/promptLab/public/assets"


def flood_fill_bg_mask(arr, bg_color, tolerance=30):
    """
    Build a background mask by flood-filling from all border pixels
    whose color is within `tolerance` of `bg_color`.
    Returns boolean array (True = background).
    """
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(float)

    # Pre-compute distance from the reference bg color
    diff = np.linalg.norm(rgb - np.array(bg_color, dtype=float), axis=2)
    potentially_bg = diff < tolerance

    visited = np.zeros((h, w), dtype=bool)
    queue = deque()

    # Seed from entire border
    for x in range(w):
        for y in [0, h - 1]:
            if potentially_bg[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))
    for y in range(1, h - 1):
        for x in [0, w - 1]:
            if potentially_bg[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))

    # BFS 4-connectivity
    while queue:
        y, x = queue.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and potentially_bg[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))

    return visited


def remove_background(img, bg_colors, tolerance=35, feather_px=2):
    """
    Remove background using multi-seed flood fill.
    bg_colors: list of RGB tuples representing background colors to remove.
    """
    img_rgba = img.convert("RGBA")
    data = np.array(img_rgba, dtype=np.uint8)

    # Union of masks for each bg color
    combined_mask = np.zeros(data.shape[:2], dtype=bool)
    for color in bg_colors:
        mask = flood_fill_bg_mask(data, color, tolerance=tolerance)
        combined_mask |= mask
        removed = mask.sum()
        total = mask.size
        print(f"    BG color RGB{tuple(int(c) for c in color)}: removed {removed}/{total} ({100*removed/total:.1f}%)")

    # Build alpha
    alpha = np.where(combined_mask, 0, 255).astype(np.uint8)

    # Feather edges
    if feather_px > 0:
        alpha_img = Image.fromarray(alpha, "L")
        blurred = alpha_img.filter(ImageFilter.GaussianBlur(radius=feather_px))
        blurred_arr = np.array(blurred)
        edge_zone = (alpha == 255) & (blurred_arr < 220)
        alpha[edge_zone] = blurred_arr[edge_zone]

    out = data.copy()
    out[:, :, 3] = alpha
    return Image.fromarray(out, "RGBA")


def detect_bg_colors(arr):
    """
    Detect distinct background colors from image corners.
    Returns list of unique bg color clusters.
    """
    h, w = arr.shape[:2]
    # Sample from all 4 corners and midpoints
    sample_points = [
        (0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1),
        (0, w // 2), (h - 1, w // 2), (h // 2, 0), (h // 2, w - 1),
    ]
    colors = [arr[y, x, :3].astype(float) for y, x in sample_points]

    # Cluster into distinct colors (simple threshold)
    clusters = []
    for color in colors:
        matched = False
        for i, cluster in enumerate(clusters):
            if np.linalg.norm(color - cluster) < 40:
                # Merge
                clusters[i] = (cluster + color) / 2
                matched = True
                break
        if not matched:
            clusters.append(color)

    return clusters


def crop_and_save(src_path, box, out_path, bg_colors=None, tolerance=35, feather_px=2):
    """
    Crop a region from src_path, remove background, save as transparent PNG.
    bg_colors: explicit list of bg colors; if None, auto-detect from corners.
    """
    print(f"\nProcessing: {out_path.split('/')[-1]}")
    src = Image.open(src_path).convert("RGB")
    cropped = src.crop(box)
    arr = np.array(cropped)
    print(f"  Crop {box} -> {cropped.size}")

    if bg_colors is None:
        bg_colors = detect_bg_colors(arr)
    print(f"  BG colors detected: {[tuple(int(c) for c in col) for col in bg_colors]}")

    result = remove_background(cropped, bg_colors, tolerance=tolerance, feather_px=feather_px)

    result.save(out_path, "PNG")

    # Quality check
    arr_out = np.array(result)
    alpha = arr_out[:, :, 3]
    total = alpha.size
    transparent_pct = (alpha == 0).sum() / total * 100
    opaque_pct = (alpha == 255).sum() / total * 100
    corners = [alpha[0, 0], alpha[0, -1], alpha[-1, 0], alpha[-1, -1]]
    print(f"  transparent={transparent_pct:.1f}%  opaque={opaque_pct:.1f}%")
    print(f"  corner alphas (target ~0): {[int(c) for c in corners]}")

    import os
    sz = os.path.getsize(out_path)
    print(f"  Saved {result.size} — {sz:,} bytes")
    return result


def main():
    login_src = f"{ASSETS}/login-wireframe.jpeg"
    home_src = f"{ASSETS}/home-wireframe.jpeg"

    # bg_colors: explicit list for images with multiple/unusual backgrounds
    # WHITE: [255, 255, 255]  MINT: ~[200, 240, 220]

    tasks = [
        # (src, box, out_path, bg_colors, tolerance)
        (
            login_src,
            (250, 70, 740, 470),
            f"{ASSETS}/mascot-login.png",
            None,   # auto-detect (mint bg)
            35,
        ),
        (
            home_src,
            (930, 205, 1179, 645),
            f"{ASSETS}/mascot-home.png",
            [[197, 242, 221], [255, 255, 255]],  # mint top + white bottom
            30,
        ),
        (
            login_src,
            (300, 70, 690, 470),
            f"{ASSETS}/mascot-learn.png",
            [[255, 255, 255]],  # pure white background
            20,
        ),
        (
            login_src,
            (882, 1838, 1130, 2046),
            f"{ASSETS}/help-cat.png",
            None,   # auto-detect
            40,
        ),
        (
            home_src,
            (1048, 34, 1126, 112),
            f"{ASSETS}/avatar-cat.png",
            None,   # auto-detect
            35,
        ),
    ]

    for src, box, out, bg_colors, tol in tasks:
        crop_and_save(src, box, out, bg_colors=bg_colors, tolerance=tol, feather_px=2)

    print("\n--- Summary ---")
    import os
    for _, _, out, _, _ in tasks:
        if os.path.exists(out):
            img = Image.open(out)
            sz = os.path.getsize(out)
            name = out.split("/")[-1]
            arr = np.array(img)
            corners = [arr[0, 0, 3], arr[0, -1, 3], arr[-1, 0, 3], arr[-1, -1, 3]]
            status = "OK" if all(c < 20 for c in corners) else "WARN(opaque corners)"
            print(f"  {name}  {img.size}  {sz:,} bytes  corners={[int(c) for c in corners]}  {status}")
        else:
            print(f"  MISSING: {out}")


if __name__ == "__main__":
    main()
