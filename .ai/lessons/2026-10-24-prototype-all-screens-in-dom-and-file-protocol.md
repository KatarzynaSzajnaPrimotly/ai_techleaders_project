# Clickable prototypes: unique ids per form, classic script for file://

Found while building `prototypes/konta-i-role/` (lekcja 07, stage 1).

- The review engine keeps every screen in the DOM at once and only hides the others. Two forms that derive element ids from the field name (`email-field`) collide: the label of the second form binds to the first form's input, so the field has no accessible name and `fill` by name fails. Use `useId()` per form instance.
- Chrome refuses `<script type="module">` on `file://`. A Vite build opened by double click shows a blank page. Build as `iife` and rewrite the script tag to `<script defer>` (see `prototypes/konta-i-role/_src/vite.config.mts`); the same output also works from any static server.
- The review engine captures clicks on `[data-goto]` and on `a[href^="#sNN"]` before React. Navigation that must pass an access check goes through `visit()` (a `prototype:navigate` event) from a button or a `data-goto`-free link; the review-bar links are intercepted with a capture listener registered before the engine's.
- A popover inside a left-aligned toolbar item with `right: 0` opens off the left edge of the window (`left: -417`), so mouse and keyboard cannot reach part of it, while programmatic `select` still works and hides the problem. Hang review-bar popovers from the toolbar itself (`position: static` on the item, `top: 100%`) and check the controls with `elementFromPoint`, not only by driving them.
- A test that selects an option by its visible label can pass for the wrong reason when the session it needs already exists. Show the effective role in account pickers and assert the state before and after the switch.
