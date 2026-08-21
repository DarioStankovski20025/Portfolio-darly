/**
 * Ref-counted body scroll lock.
 *
 * The mobile nav and a modal can both be open at once, and both used to save
 * and restore `document.body.style.overflow` independently — whichever closed
 * last won, leaving the page either stuck or scrolling behind an open overlay.
 * Counting means the style is only touched on the first lock and the last
 * unlock, so nesting is safe in any order.
 */

let depth = 0;
let previous = "";

export function lockScroll() {
  if (depth === 0) {
    previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  depth += 1;
}

export function unlockScroll() {
  depth = Math.max(0, depth - 1);
  if (depth === 0) document.body.style.overflow = previous;
}
