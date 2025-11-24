**Purpose**
- **Context:** This is a small static website for `SecureTech Solutions` (main file: `index.html`). The site is hand-authored HTML/CSS/JS — there is no framework, build step, or package manifest detected.

**Big picture**
- **Single-page static site:** `index.html` contains layout, styles (inline `<style>`), and small JS for the hero slideshow. Images and static assets live under `assets/` (e.g., `assets/logo.jpg`, `assets/*.webp`).
- **Why structured this way:** minimal-dependency, easily deployed to any static host. Keep changes small and in-place (inline CSS/JS) unless performing an intentional refactor.

**Key files & patterns**
- `index.html`: canonical source of truth. Edit this file for content, slides, header/footer, and small interactions.
- `assets/`: image and static assets. Paths in `index.html` reference this folder directly.
- CSS: kept inline in `index.html` inside a single `<style>` block. Follow existing variable names (e.g., `--neon-purple`, `--muted`) and small responsive rules at the bottom of the block.
- JS: small, imperative DOM script at the bottom of `index.html`. Patterns use `document.querySelectorAll('.slide')` and `classList.toggle('active', ...)` to control the slideshow.

**Common, project-specific edits (examples)**
- Add a hero slide: copy existing slide markup and update the image and caption.
  ```html
  <div class="slide">
    <img src="assets/new-slide.webp" alt="">
    <div class="slide-caption">New caption</div>
  </div>
  ```
- Change slideshow autoplay interval: edit the value passed to `setInterval(nextSlide, 5000);` at the bottom of `index.html`.
- Change the hero text: edit the `.hero h1` and `.hero p` block inside `index.html`.
- Update the products button target: the button navigates to `products.html`. If you add a new page, create it at project root and ensure the link matches.

**Developer workflows**
- Preview locally (use either):
  ```powershell
  python -m http.server 8000
  # or (Node)
  npx http-server -p 8000
  ```
  Then open `http://localhost:8000/index.html` in a browser. For quick edits, use the VS Code Live Server extension.
- No tests or build step present. Treat edits as direct file changes and validate visually in a browser.

**Styling & conventions**
- Keep theming via the `:root` variables at the top of the inline CSS. Reuse `--neon-*` variables for accents.
- Prefer adding small responsive rules near the existing `@media (max-width: 640px)` block instead of wholesale restructuring.
- Avoid breaking the inline CSS/JS split unless you are intentionally migrating to external files — note that CI or hosting may expect the current single-file layout.

**JS conventions & caveats**
- Slideshow uses a global `currentSlide` and `setInterval`. When adding programmatic controls, use the same pattern (mutate `currentSlide` and call `showSlide(currentSlide)`) to remain consistent.
- Navigation arrows call `prevSlide()`/`nextSlide()` inline via `onclick` attributes. If converting to event listeners, ensure semantics match for keyboard accessibility.

**Integration points & external dependencies**
- There are no external package dependencies discovered. The site relies only on standard browser APIs and local assets.
- External services: none referenced in `index.html` (no analytics, no CDN scripts). Keep external additions explicit and documented in this file.

**What to preserve when editing**
- Meta tags used for basic SEO (`<meta name="description">`) and the Google site verification meta tag at the top of `index.html` — do not remove unless intentionally changing site verification.
- The contact details in the footer (`+254 113 301 244`) if those are considered canonical content.

**If you need to refactor**
- Migrate incrementally: extract CSS to `styles.css` and JS to `app.js` only after confirming local previews still match. Keep both inline and external copies during transition so reviewers can compare.

**When in doubt**
- Ask the project owner whether they prefer preserving the single-file layout or moving to a minimal build (e.g., simple npm setup). This repo is small — conservative, in-place edits are preferred.

**Next actions for the agent**
- For content updates: edit `index.html` and preview.
- For structural refactors: propose a small PR that extracts CSS/JS into `css/` and `js/` folders with a clear migration plan and visual regression screenshots.

If any of these notes are incorrect or you want stricter rules (naming, branch/commit message format, test requirements), tell me and I will update this file.
