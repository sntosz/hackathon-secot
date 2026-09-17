# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-05-18 - Lightweight Accessible Modal Dialogs
**Learning:** In corporate ERP interfaces, simple overlay confirmation modals often lack basic WCAG modal semantics (`role="dialog"`, `aria-modal="true"`) and keyboard listeners (`Escape` key to cancel). Adding these without introducing heavyweight UI library dependencies ensures full keyboard and screen reader accessibility while maintaining lightweight bundle sizes.
**Action:** Always include ARIA modal roles, title/description associations, and keydown listeners for `Escape` on custom modal dialogs.
