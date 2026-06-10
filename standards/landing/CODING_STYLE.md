# Coding Style & Guidelines

Follow these guidelines when writing code in the `landing` app. 

## General TypeScript / SolidJS

- **SolidJS:** Since we use SSR, explicitly think about the server vs. client boundary.
- **Strict Typing:** Avoid `any`. Use `unknown` if a type is genuinely indeterminable. Use `zod` for parsing unknown data at runtime boundaries.
- **Linting:** We strictly enforce **Biome**. Do not bypass formatting or lint rules unless absolutely necessary (and if so, leave a `biome-ignore` comment with an explanation).

## State Management (Reatom)

We use **Reatom** (`@reatom/framework` + `@reatom/npm-solid-js`) instead of Redux or Context API for complex application state.
- Keep atoms small and focused.
- Derive state wherever possible rather than duplicating atoms.
- Always tie side-effects and network calls to Reatom actions or async atoms where global synchronization is needed.

## Styling (Tailwind CSS v4 & Components)

- **Tailwind v4:**.
- **Component Styling:** Use `clsx` for dynamic class concatenation.
- **Variants:** Use `tailwind-variants` (`tv`) to cleanly handle complex component states (e.g., button sizes, colors) instead of massive ternary chains.
- **UI Primitives:** Our component system builds upon **Corvu** primitives and **Ark UI**. Stick to these headless libraries rather than building complex interactive UI from scratch, as they guarantee accessibility (a11y) and proper keyboard navigation.

## Third-Party Libraries

- Avoid installing large DOM-heavy libraries. Evaluate tree-shaking capability before adding.
- E.g., Use `dayjs`.
