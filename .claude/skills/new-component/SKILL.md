# new-component

Generate a new React component with Radix UI primitives and proper TypeScript types

## When to Invoke

Use this skill when you need to create a new UI component following the project's patterns:
- Creating reusable UI elements
- Adding new components to the component library
- Building pages with consistent styling and architecture

## How It Works

This skill generates a new React component file with:
- Proper TypeScript interface for props
- Radix UI primitives where applicable
- Export statement following project conventions
- Basic structure with accessibility considerations

## Implementation

When invoked, the skill will:
1. Ask for component name and description
2. Determine if it should be a primitive or composite component
3. Generate appropriate file structure
4. Add proper imports and exports
5. Follow existing codebase patterns for consistency

## Example Usage

```
/new-component Button --description "A custom button component"
/new-component ModalDialog --description "A reusable modal dialog"
```

## Output

Creates a new file in `src/components/[ComponentName].tsx` with:
- React functional component
- TypeScript props interface
- Radix UI primitives (if applicable)
- Proper export statement
- Basic accessibility attributes