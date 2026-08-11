# Project Overview
Kopi Josjis - Coffee Roasters is a single-page web application functioning as a landing page, menu viewer, ordering system, and admin dashboard.

# Verified Technology Stack
*   **Build Tool**: Vite
*   **Language**: TypeScript, HTML
*   **Styling**: Tailwind CSS v4, custom CSS (`src/style.css`)
*   **Animations**: GSAP
*   **Backend/Database**: Supabase (via `@supabase/supabase-js`)
*   **Authentication**: Supabase Auth

# Architecture Rules
*   **Frontend-heavy SPA**: The main structure and content (like menu items) are statically written in `index.html`. 
*   **Modular TypeScript**: Logic is separated in the `src/` directory.
    *   `src/api/` handles all interactions with Supabase.
    *   `src/components/` contains UI manipulation logic and event bindings.
    *   `src/store/` contains local state management (e.g., cart).
    *   `src/animations/` contains GSAP animation logic.
*   **No Custom Backend Server**: There is no Node.js/Express server. All backend operations are direct calls to Supabase.

# Repository Rules
*   Before implementing anything, inspect the existing implementation first.
*   If information cannot be verified from the repository, do not guess. Ask for clarification.
*   Prefer extending existing functionality over creating duplicate functionality.
*   Never modify unrelated files.

# Anti-Hallucination Rules
1.  The repository is the primary source of truth.
2.  Do not assume something exists just because it is visible in the UI.
3.  Do not invent API endpoints.
4.  Do not invent database tables or columns.
5.  Do not invent authentication flows.
6.  Do not invent environment variables.
7.  Do not invent dependencies.
8.  Do not invent folder structures.
9.  Do not refactor architecture unless explicitly requested.
10. Do not perform unsolicited refactoring.
11. If information cannot be verified, mark it as UNKNOWN.
12. Do not turn UNKNOWNs into assumptions.
13. If there are multiple implementation possibilities, explain them and ask for confirmation before proceeding.

# Coding Rules
*   Use TypeScript for all new logic.
*   Use Tailwind CSS v4 utility classes for styling. Avoid writing custom CSS unless absolutely necessary.
*   Follow the existing modular structure in `src/`.

# Naming Conventions
*   Variables and functions: camelCase.
*   Files in `src/components/`, `src/store/`, `src/api/`: PascalCase or camelCase according to existing files (e.g., `AdminUI.ts`, `cartStore.ts`).
*   Interfaces/Types: PascalCase.

# File Modification Rules
*   Do not overwrite `index.html` structure heavily without understanding its dependencies with `src/components` UI controllers.
*   When adding new UI elements that require interactivity, map them appropriately in `src/components`.

# Debugging Workflow
*   Check browser console for errors.
*   Verify Supabase network calls.
*   Validate local state in `cartStore.ts` for order-related bugs.

# Testing Requirements
*   UNKNOWN. There is currently no automated testing framework (Jest/Vitest) installed in this repository. 
*   Do not invent tests until a framework is integrated.

# Security Rules
*   Supabase anon key is public, but do not expose service role keys.
*   Admin dashboard access is strictly gated by Supabase Auth (email/password). 
*   Do not bypass authentication checks in `AdminUI.ts`.

# Database Rules
*   Only interact with verified tables: `orders` and `config`.
*   Do not assume the existence of a `products` or `users` table unless verified in Supabase configuration or API calls.

# API Rules
*   Use the existing wrappers in `src/api/` (`configApi.ts`, `orderApi.ts`) instead of calling `supabase` directly from UI components whenever possible.

# Definition of Done
*   Feature is fully implemented according to verified architecture.
*   No hallucinated dependencies or endpoints were used.
*   Code runs locally without console errors.
*   Does not break existing flows (e.g., Cart, Checkout, Admin).
