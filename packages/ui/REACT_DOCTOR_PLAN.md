# React Doctor Fix Plan — @diffity/ui (88/100 → 95+)

**Score:** 88/100 — 141 issues across 45/136 files

---

## P0 — Quick Wins (94 issues, ~30 min)

### 1. Tailwind `size-N` shorthand — 84 issues — Effort: S
**What:** Replace `w-5 h-5` → `size-5` when both axes match.
**Why:** Tailwind v3.4+ supports `size-N` as shorthand. Purely mechanical, 1:1 drop-in replacement. No visual change.
**Approach:** Regex bulk replace in all `.tsx` files.

**52 convertible instances found in `src/`:**
- `w-3 h-3` (most common — icons) → `size-3`
- `w-4 h-4` → `size-4`
- `w-5 h-5` → `size-5`
- `w-6 h-6` → `size-6`
- `w-8 h-8` → `size-8`
- `w-12 h-12` → `size-12`

**Excluded (different axes):** `w-48 h-4` (summary-bar.tsx:35), `min-w-5 h-5` (sidebar.tsx:81, tree-sidebar.tsx:159), `min-w-6 h-5` (shortcut-modal.tsx:82) — these don't match, skip.

**Files affected (28):** error-page, file-tree-item, tree-sidebar, tour-panel, root, tree-page, chevron-down-icon, file-block, hunk-block, github-dialog, hunk-block-split, chevron-icon, options-menu, shortcut-modal, sidebar, toolbar, summary-bar, skeleton, chevron-up-icon, folder-icon, file-icon, spinner, general-comments, comment-toolbar-actions, rich-diff-viewer, code-icon, comment-line-number, comment-bubble

### 2. Array index as key — 10 issues — Effort: S
**What:** Replace `key={i}` with stable unique identifiers.
**Why:** Array indices as keys break React reconciliation on reorder/filter/insert/delete — causes wrong DOM reuse, stale state, and UI bugs.
**Fix:** Use content-based keys (line number, path, hash). For diff lines, use `leftNum`/`rightNum` combination.

**Flagged file:** `src/components/diff/hunk-block-split.tsx:175`
```tsx
// Current:
<tr key={`${keyPrefix}-${i}`} className="group/split-row ...">
// Fix: use line numbers as key
<tr key={`${keyPrefix}-L${leftNum ?? 'null'}-R${rightNum ?? 'null'}`} ...>
```

---

## P1 — Important Fixes (18 issues, ~30 min)

### 3. Accessibility: nested interactive elements — 14 issues — Effort: M
**What:** `<span onClick>` inside `<button>` is invalid HTML + a11y violation.
**Why:** 
- Nested interactive elements are invalid HTML (WCAG 4.1.2)
- Keyboard users can't interact with the inner `<span>` (WCAG 2.1.1)
- Screen readers don't know the chevron is a separate interactive element

**Flagged file:** `src/components/tree/file-tree-item.tsx:70`
```tsx
// Current (INVALID - interactive element nested inside button):
<button onClick={handleRowClick} onContextMenu={handleContextMenu}>
  <span onClick={handleChevronClick} className="...">
    <ChevronIcon expanded={isExpanded} />
  </span>
  ...
</button>

// Fix: Remove inner click handler, use the outer button's click with modifier
// OR restructure as two sibling buttons with proper ARIA
```

**Approach options:**
- **Option A:** Remove inner `<span onClick>`, handle chevron toggle via Shift+click or keyboard modifier on the outer `<button>`
- **Option B:** Restructure as two sibling `<button>` elements (one for chevron, one for file) with proper ARIA group
- **Option C:** Keep single `<button>`, move chevron click logic into the outer handler (detect click target)

### 4. Inline render functions — 3 issues — Effort: M (verify first)
**What:** `renderContent()` call in JSX.
**Why:** Inline render functions are recreated every render, breaking reconciliation.
**Status:** `renderContent` is imported from `../../lib/render-content` — it's already extracted to a module. The linter may be flagging the call pattern, not an actual inline function. **Verify if this is a false positive before fixing.**

**Flagged file:** `src/components/diff/diff-line.tsx:74`
```tsx
// Current:
<span className="inline">{renderContent(line, syntaxTokens)}</span>
// Note: renderContent is already imported from a module.
// The <span className="inline"> wrapper is redundant (default display for span).
// Fix: Remove wrapper or verify false positive.
```

### 5. useState → useRef — 2 issues — Effort: S (verify first)
**What:** Replace `useState` with `useRef` for values never read in JSX.
**Status:** After code review, `pendingSelection` in `file-viewer.tsx` IS used in rendering (line highlighting, comment form visibility). **This may be a false positive.** Verify by checking if the value drives any JSX output.

**Flagged file:** `src/components/tree/file-viewer.tsx:44`
```tsx
const [pendingSelection, setPendingSelection] = useState<LineSelection | null>(null);
// Used at: line 133 (getLineHighlightType), line 254 (comment form render)
// VERDICT: useState is CORRECT here — value drives rendering.
```

**Also:** `src/components/diff/diff-page.tsx:42` — same pattern, same analysis needed.

### 6. Async defer await — 2 issues — Effort: S
**What:** Fire-and-forget async function in `useEffect`.
**Why:** `poll()` is called without `await`, creating an implicit fire-and-forget promise. The cleanup (`cancelled = true`) works via closure, but the pattern is fragile.
**Fix:** Make intent explicit with IIFE wrapper, or restructure to avoid recursive async setTimeout.

**Flagged file:** `src/hooks/use-diff-staleness.ts:29`
```tsx
// Current:
poll(); // fire-and-forget async function
// Fix: wrap in IIFE for explicit intent
(async () => { await poll(); })();
```

---

## P2 — Refactors (29 issues, ~1-2 hrs)

### 7. Giant components — 3 issues — Effort: L
**What:** Break down `DiffPage` (389 lines, 17 useState, 10 useCallback, 4 useMemo) into focused sub-components.
**Why:** Large components hurt readability, testing, and cause unnecessary re-renders. Target: <200 lines each.
**Fix:** Extract into hooks and child components.

**Flagged file:** `src/components/diff/diff-page.tsx:25`
- Extract `useDiffPageState()` hook — file/review/collapse state
- Extract `useDiffPageKeyboard()` hook — keyboard bindings
- Extract `<DiffHeader />` — toolbar + stale banner
- Extract `<DiffContent />` — main diff view
- Extract `<DiffSidebar />` — file tree sidebar

### 8. useReducer consolidation — 3 issues — Effort: L
**What:** Replace related `useState` calls in `DiffPage` with `useReducer`.
**Why:** 17 `useState` calls is hard to reason about. Related state should be centralized.
**Fix:** Group related state into reducer actions.

```tsx
// Current (17 useState calls):
const [viewMode, setViewMode] = useState(...);
const [hideWhitespace, setHideWhitespace] = useState(false);
const [showHelp, setShowHelp] = useState(false);
const [activeFile, setActiveFile] = useState<string | null>(null);
const [reviewedFiles, setReviewedFiles] = useState<Set<string>>(new Set());
const [collapsedFiles, setCollapsedFiles] = useState<Set<string>>(new Set());
const [pendingSelection, setPendingSelection] = useState<LineSelection | null>(null);
// ... 10 more

// Fix: useReducer for related state groups
const [diffState, diffDispatch] = useReducer(diffReducer, initialState);
const [tourState, tourDispatch] = useReducer(tourReducer, tourInitialState);
```

### 9. Cascading setState — 1 issue — Effort: M
**What:** 4 `setState` calls in a single `useEffect`.
**Why:** Multiple setState calls signal imperative syncing instead of declarative derivation. React 18 batches them, but it's still a code smell.
**Fix:** Consolidate into single state object or useReducer.

**Flagged file:** `src/components/tree/tree-page.tsx:315`
```tsx
// Current (4 setState calls):
useEffect(() => {
  setTourSubHighlight(null);
  setGotoHighlight(null);
  if (!tourData || ...) return;
  const step = tourData.steps[tourStepIndex - 1];
  if (step) {
    setInternalNav({ path: step.filePath, type: 'file' });
    setPreviewMode('preview');
  }
}, [tourData, tourStepIndex]);

// Fix: consolidate into single state object
const [tourState, setTourState] = useState({
  subHighlight: null,
  gotoHighlight: null,
  internalNav: null,
  previewMode: 'preview',
});
```

### 10. SVG decimal precision — 5 issues — Effort: S
**What:** Truncate SVG path decimals from 4+ to 1-2 places.
**Why:** Each extra decimal adds bytes across every coordinate. At normal display sizes, sub-pixel precision is invisible.
**Fix:** Manually round SVG path coordinates to 2 decimal places.

**Flagged file:** `src/components/icons/trash-icon.tsx:6`
```tsx
// Current (4 decimal places):
d="M14.7223 12.7585C14.7426 12.3448 14.4237 11.9929 14.01 11.9726..."
// Fix (2 decimal places):
d="M14.72 12.76C14.74 12.34 14.42 11.99 14.01 11.97..."
```

---

## Execution Order

| Phase | Issues | Count | Effort | Time Est |
|-------|--------|-------|--------|----------|
| Phase 1 | size-N shorthand | 84 | S | 10 min |
| Phase 2 | Array index keys | 10 | S | 10 min |
| Phase 3 | a11y (nested interactive) | 14 | M | 20 min |
| Phase 4 | Async await, SVG precision | 7 | S | 10 min |
| Phase 5 | Verify false positives (inline render, useRef) | 5 | S | 10 min |
| Phase 6 | Giant components, useReducer, cascading setState | 7 | L | 1-2 hrs |

**Phases 1-4 fix 115/141 issues (82%) in ~50 min.**
**Phase 5 verifies potential false positives.**
**Phase 6 is deeper refactoring for remaining 21 issues.**

---

## Potential False Positives (Need Verification)

| Issue | File | Why Suspect |
|-------|------|-------------|
| Inline render | diff-line.tsx:74 | `renderContent` already imported from module |
| useState→useRef | file-viewer.tsx:44 | `pendingSelection` drives rendering (line highlighting, comment form) |
| useState→useRef | diff-page.tsx:42 | Same pattern — verify if value appears in JSX |

---

## Verification Plan
After each phase:
1. `npm run build` — ensure no build errors
2. `npm run test` — ensure no test regressions
3. `npx react-doctor@latest` — verify score improvement
4. Manual spot-check in browser for affected components

---

## Research Sources

| Topic | Key Finding | Source |
|-------|-------------|--------|
| Tailwind size-N | v3.4+, 1:1 drop-in for w-N h-N | tailwindcss.com/blog/tailwindcss-v3-4 |
| Inline render | Breaks reconciliation, causes remounts | dev.to/shameel, reddit.com/r/reactjs |
| Giant components | Target 150-250 lines, extract hooks | medium.com/geekculture |
| SVG precision | 1-2 decimals sufficient, use SVGO | css-tricks.com, sarasoueidan.com |
| Async await | Move await after sync guards | ajanibilby.com, madelinemiller.dev |
| useState vs useRef | useRef for non-render values | dev.to/trinityyi, thoughtspile.github.io |
| a11y click+key | WCAG 2.1.1, prefer <button> | github.com/jsx-eslint/eslint-plugin-jsx-a11y |
| a11y static role | WCAG 4.1.2, use semantic HTML | biomejs.dev, github.com/jsx-eslint |
| Array index key | Breaks on reorder/filter/insert | robinpokorny.com, developerway.com |
| useReducer | 3+ related states → reducer | robinwieruch.de, dev.to/talha131 |
| Cascading setState | React 18 batches, still a code smell | wisdomgeek.com, letsbuild.cloud |
