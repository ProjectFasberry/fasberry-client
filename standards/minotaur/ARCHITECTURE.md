# Architecture & Project Structure

The frontend is an SSR-enabled web application built heavily on **Vike** and **Elysia**.

## Core Technologies

- **Vike** (`vike` & `vike-react`): The meta-framework. It controls routing, SSR (Server-Side Rendering), and page lifecycle.
- **Elysia** (`elysia` & `@vikejs/elysia`): High-performance Bun web framework driving the backend/SSR server process.
- **React 19**: Rendering library.
- **Bun**: Fast JavaScript runtime and test runner.

## Folder Structure

- `/pages/`: Contains the application routes. Vike uses a file-system-based routing mechanism.
- `/renderer/`: Vike shell and layout configurations. Contains global providers (Reatom, Paraglide i18n) and SSR context configuration (`+onCreatePageContext.server.ts`, etc.).
- `/shared/`: Shared domain logic, generic Reatom atoms, utility functions, and universal components.
- `/assets/`: Static and compiled assets.
- `/public/`: Public files served at the root URL.
- `/messages/` & `/paraglide/` & `/project.inlang/`: Translation files, Paraglide SDK outputs, and Inlang configurations.

## Server-Side Rendering (SSR)

- Vike pre-renders React components on the server. Ensure that browser-specific APIs (`window`, `document`) are strictly conditionally accessed or isolated within `useEffect` / client-only components.
- Elysia acts as the host for Vike middleware. The built server lives at `dist/server/index.mjs`.

## API Integration

- Handled using `ky` and `openapi-fetch`.
- Keep API clients strictly typed with the OpenAPI specs (often synchronized from a shared repository like `@repo/shared`).
