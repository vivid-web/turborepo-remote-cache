# Agent Guidelines for Remote Cache Monorepo

## Commands

- **Build**: `pnpm build` (`turbo run build`)
- **Lint**: `pnpm lint` (`turbo run lint`)
- **Typecheck**: `pnpm typecheck` (`turbo run typecheck`)
- **Format**: `pnpm format` (`turbo run format`)
- **Dev**: `pnpm dev` (`turbo run dev`)
- **Test**: No tests configured yet

## Code Style

- **Language**: TypeScript with strict type checking
- **Imports**: Absolute paths with `@/` alias, workspace packages with `@remote-cache/`
- **Naming**: camelCase for functions/variables, PascalCase for components/types
- **Formatting**: Tabs, Prettier with Tailwind plugin
- **Validation**: Zod schemas for input validation
- **Error Handling**: Throw errors, no try/catch unless necessary
- **Styling**: clsx/twMerge for conditional classes, Tailwind CSS
- **Server Functions**: TanStack React Start with createServerFn
- **Unused Vars**: Prefix with `_` to ignore, otherwise error
- **Imports**: No cycles, no extraneous dependencies
