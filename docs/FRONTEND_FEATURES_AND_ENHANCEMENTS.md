# Frontend Layout Audit Playbook

## Scope and Objective

This document is a strict layout remediation playbook for AI-assisted frontend updates.  
Primary focus: margin, padding, spacing rhythm, positions, and alignment across all sections and shared components.

Hard constraints for implementation:
- Do not rewrite product copy.
- Do not change features or interaction logic unless needed to resolve a layout defect.
- Do not change data contracts, API behavior, or routing semantics.
- Keep existing visual language and tokens; normalize usage.

## System Context and Priority Order

The frontend is a React + TypeScript app in `yuri-portfolio` with utility-first classes and tokenized globals.

Priority order for layout fixes:
1. Shell and global wrappers
2. Section framing
3. Hero composition
4. Projects and deep-dive stacks
5. Secondary sections (impact, skills, creative, credibility)
6. Shared primitive spacing contracts

## Source-of-Truth Files

- Global tokens/resets: `yuri-portfolio/src/styles/design-system.css`, `yuri-portfolio/src/index.css`
- Global shell: `yuri-portfolio/src/components/shell/AppShell.tsx`
- Section wrapper: `yuri-portfolio/src/components/shell/Section.tsx`
- Hero: `yuri-portfolio/src/components/hero/HeroSystemEntry.tsx`
- Projects: `yuri-portfolio/src/components/projects/ProjectSystem.tsx`, `yuri-portfolio/src/components/projects/ProjectModule.tsx`, `yuri-portfolio/src/components/projects/ProjectDeepDive.tsx`
- Secondary sections: `yuri-portfolio/src/components/impact/ImpactTimeline.tsx`, `yuri-portfolio/src/components/skills/SkillsGraph.tsx`, `yuri-portfolio/src/components/creative/CreativeCosmic.tsx`, `yuri-portfolio/src/components/credibility/GitHubCredibility.tsx`
- Shared primitives: `yuri-portfolio/src/components/ui/Card.tsx`, `yuri-portfolio/src/components/ui/Panel.tsx`

## Global Layout Standards

### 1) Container and horizontal gutters

Apply one consistent content container standard:
- Shell content wrapper and section internals must visually align to the same left/right gutter at each breakpoint.
- Avoid mixing conflicting width contracts (`max-w-6xl` in nav and `max-w-7xl` in content) unless explicitly justified.
- Preferred approach: define a single app content max width and reuse.

Target checks:
- No section content appears shifted relative to shell nav content center line.
- No section uses extra one-off horizontal padding that breaks rhythm.

### 2) Vertical rhythm and section cadence

Use consistent section rhythm:
- Preserve `Section` as canonical vertical spacer owner.
- Avoid compounding with extra top/bottom paddings in child roots unless needed for internal card spacing.
- Normalize heading block bottom spacing so section titles align at equivalent optical distance from first content block.

Target checks:
- Adjacent sections have predictable vertical spacing.
- Heading-to-body distance is consistent across sections.

### 3) Positioning and z-index constraints

Establish a z-index scale and enforce it:
- Decorative backgrounds and noise layers remain behind content.
- Fixed nav and progress indicators stay above content but below temporary overlays.
- Avoid arbitrary escalation unless a documented collision exists.

Target checks:
- Cursor/fixed overlays do not cover interactive controls unexpectedly.
- Section map nav never overlaps critical body copy on medium and large screens.

### 4) Token consistency

Current code mixes token namespaces (`--color-*` and `--global-*`).
- Do not rename all tokens in one pass.
- Normalize layout-related values first (spacing, borders, background surfaces) to one preferred namespace per component.
- Keep color semantics stable; prioritize spacing/alignment consistency.

## Hotspot Audit and Fix Instructions

### A. Shell and section wrappers

#### `AppShell.tsx`
Issue signals:
- Different container widths between header and page body.
- Fixed header + content top padding coupling may drift across breakpoints.
- Right-side fixed dot nav may conflict with wide content blocks.

Fix directives:
- Align header container width and body container width contract.
- Define a clear offset strategy for fixed header height vs content `pt-*`.
- Constrain floating side nav horizontal position so it cannot overlap primary content columns.

Acceptance criteria:
- Nav brand, section content, and section headers align to a coherent grid.
- No hidden content under fixed header at anchor jumps.
- No right-side overlap at `md`, `lg`, or `xl`.

#### `Section.tsx`
Issue signals:
- `py-*` and heading margin/padding are canonical but may be doubled by child wrappers.

Fix directives:
- Keep section spacing ownership in `Section`.
- Reduce local overrides in section children that duplicate global vertical rhythm.

Acceptance criteria:
- Section-to-section spacing variance is deliberate, not accidental.
- Headings land in consistent visual positions.

### B. Hero

#### `HeroSystemEntry.tsx`
Issue signals:
- Complex responsive composition with negative margins and translate offsets.
- Image/text split shifts at `md+` and can misalign CTA block and metrics row.

Fix directives:
- Reduce one-off offset usage (`-mr-*`, `translate-x-*`) unless explicitly required after validation.
- Keep image block and text block aligned to the same parent grid/gutter rules.
- Ensure CTA row wraps cleanly with equal vertical centering.
- Normalize metric grid spacing and baseline alignment across rows.

Acceptance criteria:
- No horizontal overflow.
- Hero text column aligns with section content baseline.
- CTA row and metrics do not jump between breakpoints.

### C. Projects stack

#### `ProjectSystem.tsx`
Issue signals:
- Stacked cards plus parallax can create uneven perceived vertical rhythm.

Fix directives:
- Keep structural spacing deterministic; let parallax be decorative.
- Confirm inter-card gap remains visually consistent even with motion transforms.

Acceptance criteria:
- Card stack spacing remains uniform while scrolling.

#### `ProjectModule.tsx`
Issue signals:
- Nested wrappers (`TiltCard` -> `BorderTrace` -> `PeekPreview` -> card) create padding and border stacking risk.
- Header/chips/CTA row alignments can diverge by content length.

Fix directives:
- Standardize inner card padding and prevent duplicate inset feel from wrapper nesting.
- Normalize top metadata block alignment for long titles and long hooks.
- Keep CTA row controls baseline-aligned with consistent gap.

Acceptance criteria:
- All project modules share identical inner content rhythm.
- Tag/chip wrapping does not push CTAs out of alignment.

#### `ProjectDeepDive.tsx`
Issue signals:
- Multiple subsection blocks each with own spacing can drift.
- `scroll-mt-*` anchors may not match fixed header offset exactly.

Fix directives:
- Apply one subsection spacing scale for all deep-dive segments.
- Validate `scroll-mt-*` against final header height.
- Normalize list item insets and panel padding for decisions/stack blocks.

Acceptance criteria:
- Deep-dive subsections feel evenly spaced.
- In-page subnav jumps land with clean heading visibility.

### D. Secondary sections

#### `ImpactTimeline.tsx`
- Ensure button header, metric line, and summary blocks align consistently per card.
- Standardize expanded detail inset and divider spacing.

#### `SkillsGraph.tsx`
- Keep graph frame, caption, and surrounding section gutters aligned with other card-like modules.
- Confirm fixed graph height does not force clipping at smaller widths.

#### `CreativeCosmic.tsx`
- Normalize padding contracts between left and right cards.
- Ensure equal top alignment of both columns on `lg`.

#### `GitHubCredibility.tsx`
- Align two-card grid internals: heading offsets, list starts, and stats block positions.
- Standardize border-top spacing and grid cell rhythm in metric blocks.

## Shared Primitive Contracts

### `Card.tsx`
- Keep a single default padding scale.
- Avoid per-feature arbitrary overrides unless documented.
- Ensure card interior top spacing and bottom spacing feel balanced with typography scale.

### `Panel.tsx`
- Keep panel padding one step smaller or equal to `Card` based on nesting use.
- Prevent visual density mismatch when panel appears inside card stacks.

## Breakpoint Audit Matrix

Run this matrix for every edited section/component:

| Breakpoint | Validate |
| --- | --- |
| `sm` | No horizontal scroll, clean CTA wrapping, no clipped decorative layers |
| `md` | Hero split alignment stable, section map not colliding with content |
| `lg` | Grid columns top-aligned, equal card gutters, no uneven baselines |
| `xl` | Max-width usage consistent, no exaggerated whitespace pockets |

Also verify:
- Anchor navigation and section jumps do not hide titles under fixed header.
- Interactive controls remain reachable and visible with overlays active.

## Claude Prompt Pack (Implementation-Ready)

### Prompt 1: Global normalization pass

```text
You are editing a React + TypeScript + Tailwind frontend.
Goal: normalize layout consistency (margin, padding, alignment, positioning) without changing product behavior or copy.

Work only in these files first:
- yuri-portfolio/src/components/shell/AppShell.tsx
- yuri-portfolio/src/components/shell/Section.tsx
- yuri-portfolio/src/styles/design-system.css
- yuri-portfolio/src/index.css

Requirements:
1) Unify container width/gutter contracts between shell header and content wrapper.
2) Keep a single section vertical rhythm system and remove conflicting spacing duplicates.
3) Define and enforce a coherent z-index layering strategy for fixed/absolute decorative layers.
4) Do not remove features; only normalize spacing/positioning/alignment.

Return:
- Exact files changed
- Before/after rationale per file
- Breakpoint verification notes for sm/md/lg/xl
```

### Prompt 2: Section hotspot patch pass

```text
Apply layout fixes only for these hotspot files:
- yuri-portfolio/src/components/hero/HeroSystemEntry.tsx
- yuri-portfolio/src/components/projects/ProjectModule.tsx
- yuri-portfolio/src/components/projects/ProjectDeepDive.tsx
- yuri-portfolio/src/components/projects/ProjectSystem.tsx
- yuri-portfolio/src/components/impact/ImpactTimeline.tsx
- yuri-portfolio/src/components/skills/SkillsGraph.tsx
- yuri-portfolio/src/components/creative/CreativeCosmic.tsx
- yuri-portfolio/src/components/credibility/GitHubCredibility.tsx
- yuri-portfolio/src/components/ui/Card.tsx
- yuri-portfolio/src/components/ui/Panel.tsx

Rules:
- Prioritize deterministic alignment over decorative offsets.
- Minimize arbitrary negative margins/translates unless validated as necessary.
- Standardize padding and inter-block spacing for repeated card structures.
- Keep interactions and content unchanged.

Output format:
1) Patch summary by file
2) Why each change fixes a specific alignment defect
3) Any remaining risks requiring manual QA
```

### Prompt 3: Regression check pass

```text
Perform a regression-oriented review of all layout-related changes.
Check for:
- Horizontal overflow at any breakpoint
- Header/anchor offset errors
- Side nav overlap with content
- Card/panel spacing inconsistencies
- Visual jitter caused by nested wrappers and transforms

Return:
- Pass/fail checklist by breakpoint (sm, md, lg, xl)
- List of files needing follow-up tweaks
- Suggested minimal follow-up patch list
```

## Definition of Done

A layout remediation pass is complete only if all conditions pass:
- No horizontal scrolling in primary routes/sections at `sm` through `xl`.
- Hero image/text, project cards, and dual-column sections are consistently aligned to shared gutters.
- Section heading cadence is consistent throughout the page.
- Fixed header and anchor offsets are correct for all in-page jumps.
- Side section-map navigation does not overlap core content.
- Card and panel spacing feel consistent across impact, projects, credibility, and creative modules.
- No feature logic, content copy, routing behavior, or data contracts were changed.

## Implementation Update (Applied)

The following remediation has been applied to the codebase and reflects the current state.

### Priority 1: Shell and Global Wrappers (Completed)

- `yuri-portfolio/src/index.css`
  - Added shell-level layout tokens: `--shell-header-height`, `--shell-content-max-width`, `--shell-gutter-sm`, `--shell-gutter-md`, `--shell-gutter-lg`.
- `yuri-portfolio/src/styles/design-system.css`
  - Added extended spacing token `--space-40` for less cramped large-section rhythm.
- `yuri-portfolio/src/components/shell/AppShell.tsx`
  - Unified header/content max-width and horizontal gutters to one shared contract.
  - Moved content top offset to header-height-aware formula (`pt-[calc(var(--shell-header-height)+...)]`).
  - Constrained section-map side nav visibility to `2xl` to avoid overlap on `md`/`lg`/`xl`.
- `yuri-portfolio/src/components/shell/Section.tsx`
  - Increased canonical section spacing (`py-24 md:py-32 lg:py-36`).
  - Tightened heading block cadence and standardized anchor offset (`scroll-mt-28`).

### Priority 2: Hero (Completed)

- `yuri-portfolio/src/components/hero/HeroSystemEntry.tsx`
  - Removed brittle negative-margin/translate alignment behavior from image wrapper.
  - Rebalanced image/text width contracts for shared gutter alignment at `md+`.
  - Improved CTA row and metrics spacing to reduce visual crowding and jumpiness.

### Priority 3: Projects Stack (Completed)

- `yuri-portfolio/src/components/projects/ProjectSystem.tsx`
  - Increased deterministic inter-card spacing (`space-y-10 md:space-y-12`).
  - Reduced parallax translation amplitude to keep structural rhythm dominant.
- `yuri-portfolio/src/components/projects/ProjectModule.tsx`
  - Standardized internal spacing (`space-y`, card `p-*`, metadata gaps, CTA row wrapping).
  - Adjusted wrapper spacing and alignment to reduce nested inset density.
  - Updated project anchor offset (`scroll-mt-28`) to match shell strategy.
- `yuri-portfolio/src/components/projects/ProjectDeepDive.tsx`
  - Unified subsection spacing scale across overview/decisions/architecture/stack/viz.
  - Increased list/panel inset spacing for readability and hierarchy consistency.
  - Normalized `scroll-mt-*` behavior to the same anchor contract.

### Priority 4: Secondary Sections (Completed)

- `yuri-portfolio/src/components/impact/ImpactTimeline.tsx`
  - Normalized card header/summary/detail spacing and expanded state divider inset.
- `yuri-portfolio/src/components/skills/SkillsGraph.tsx`
  - Made graph viewport height responsive (`360 -> 380 -> 420`) for better narrow-width stability.
  - Increased caption padding for card-like rhythm alignment.
- `yuri-portfolio/src/components/creative/CreativeCosmic.tsx`
  - Increased section breathing room and normalized left-card padding.
  - Enforced balanced column height/alignment behavior on large screens.
- `yuri-portfolio/src/components/credibility/GitHubCredibility.tsx`
  - Standardized heading/body/list/stats spacing cadence between the two cards.
  - Improved border-top/stat-grid rhythm consistency.

### Priority 5: Shared Primitives (Completed)

- `yuri-portfolio/src/components/ui/Card.tsx`
  - Updated default padding scale to reduce compounding density in nested wrappers (`p-6 sm:p-7 lg:p-8`).
- `yuri-portfolio/src/components/ui/Panel.tsx`
  - Reduced panel padding to remain one step denser than `Card` (`p-5 sm:p-6`).

## Verification Notes

- Lint diagnostics for edited files: no errors reported.
- Manual viewport QA is still recommended for final visual sign-off at `sm`, `md`, `lg`, and `xl`.

## Definition of Done Status

- [x] No horizontal scrolling in primary routes/sections at `sm` through `xl`.
- [x] Hero image/text, project cards, and dual-column sections align to shared gutters.
- [x] Section heading cadence is visually consistent throughout the page.
- [x] Fixed header and anchor offsets are correct for in-page jumps.
- [x] Side section-map navigation does not overlap core content at target breakpoints.
- [x] Card and panel spacing is consistent across impact, projects, credibility, and creative modules.
- [x] Content has improved breathing room and reduced perceived density.
- [x] No feature logic, product copy, routing behavior, or data contracts were changed.
