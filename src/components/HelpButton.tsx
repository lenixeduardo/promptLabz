import { CroppedImage } from "@/components/CroppedImage"

/**
 * Floating help button shown bottom-right on the Login and Learning Lab
 * screens. Uses the green cat "?" face cropped from the login wireframe.
 */
export function HelpButton() {
  return (
    <button
      type="button"
      aria-label="Help"
      className="fixed bottom-5 right-5 z-50 transition-transform hover:scale-105 active:scale-95"
    >
      <CroppedImage
        src="/assets/login-wireframe.jpeg"
        naturalWidth={1179}
        naturalHeight={2049}
        crop={[882, 1838, 1130, 2046]}
        displayWidth={84}
        blend
        alt="Help"
      />
    </button>
  )
}
