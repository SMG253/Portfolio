// Theme handling (dark / light) - shared by all pages.
// This file is loaded in <head> (not deferred) so the saved theme is applied
// before the page is painted, which avoids a "flash" of the wrong theme.

const STORAGE_KEY = "theme";
const root = document.documentElement; // the <html> element

// 1. Apply the saved choice immediately (if the user made one before).
//    localStorage can throw in some private modes, so wrap it in try/catch.
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") {
    root.dataset.theme = saved; // sets <html data-theme="...">
  }
} catch (error) {
  // Storage unavailable: fall back to the OS preference (handled by CSS).
}

// Returns the theme currently on screen: the manual choice if there is one,
// otherwise the operating-system preference.
function getCurrentTheme() {
  if (root.dataset.theme) {
    return root.dataset.theme;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

// Keeps the toggle button's state in sync for screen readers.
function updateToggleButton(button) {
  button.setAttribute("aria-pressed", String(getCurrentTheme() === "dark"));
}

// 2. Wire up the toggle button once the page's HTML has loaded.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  updateToggleButton(toggle);

  toggle.addEventListener("click", () => {
    const next = getCurrentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // Ignore: the theme still changes for this visit.
    }
    updateToggleButton(toggle);
  });

  // If the OS theme changes and the user never chose manually, update the button.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    updateToggleButton(toggle);
  });
});
