import { cn } from "@/lib/utils"

interface CroppedImageProps {
  /** Source image path */
  src: string
  /** Natural width of the source image in px */
  naturalWidth: number
  /** Natural height of the source image in px */
  naturalHeight: number
  /** Crop rectangle in source pixels: [x0, y0, x1, y1] */
  crop: [number, number, number, number]
  /** Rendered width of the crop in px (height is derived from the crop ratio) */
  displayWidth: number
  /**
   * Blends the (near-white) source background into the page using
   * `mix-blend-mode: multiply`, so the cat appears to sit on a transparent
   * background instead of a white box. Works against light page backgrounds.
   */
  blend?: boolean
  className?: string
  alt?: string
}

/**
 * Renders an exact pixel crop of a larger source image using CSS background
 * sizing/positioning. Used to extract the cat mascots from the uploaded
 * wireframe screenshots without needing an image-editing tool.
 */
export function CroppedImage({
  src,
  naturalWidth,
  naturalHeight,
  crop,
  displayWidth,
  blend = false,
  className,
  alt = "",
}: CroppedImageProps) {
  const [x0, y0, x1, y1] = crop
  const cropW = x1 - x0
  const cropH = y1 - y0
  const scale = displayWidth / cropW
  const displayHeight = cropH * scale

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("bg-no-repeat", className)}
      style={{
        width: displayWidth,
        height: displayHeight,
        backgroundImage: `url(${src})`,
        backgroundSize: `${naturalWidth * scale}px ${naturalHeight * scale}px`,
        backgroundPosition: `${-x0 * scale}px ${-y0 * scale}px`,
        mixBlendMode: blend ? "multiply" : undefined,
      }}
    />
  )
}
