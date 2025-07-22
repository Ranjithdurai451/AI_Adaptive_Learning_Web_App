# Agent Guidelines

This file provides guidelines for agentic coding agents operating in this repository.

## Build/Lint/Test Commands

**Backend:**
- Build: N/A (Bun automatically builds)
- Dev: `bun --watch index.ts`

**Frontend:**
- Build: `tsc -b && vite build`
- Lint: `eslint .`
- Dev: `vite`

## Code Style Guidelines

- **Imports:** Use absolute imports when possible.
- **Formatting:** Follow Prettier formatting.
- **Types:** Use TypeScript for all code.
- **Naming Conventions:** Use descriptive names.
- **Error Handling:** Use try-catch blocks for error handling.

## Additional Notes

- Follow the existing project structure and conventions.
- Add comments to explain complex logic.
- Write unit tests for new functionality.
