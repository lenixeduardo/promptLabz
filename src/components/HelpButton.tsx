/**
 * Floating help button shown bottom-right on the Login and Learning Lab screens.
 */
export function HelpButton() {
  return (
    <button
      type="button"
      aria-label="Help"
      className="fixed bottom-5 right-5 z-50 transition-transform hover:scale-105 active:scale-95"
    >
      <img
        src="/assets/help-cat.png"
        alt="Help"
        className="h-20 w-auto object-contain drop-shadow-lg"
      />
    </button>
  )
}
