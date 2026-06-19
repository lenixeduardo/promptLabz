# UI Accessibility Reviewer

**Purpose**: Automated accessibility auditing of React components using axe-core or similar tools

**When to Invoked**: After UI component creation or modification

**Configuration**:
- Runs accessibility tests on modified components
- Reports violations with severity levels
- Suggests fixes based on WCAG guidelines
- Integrates with existing testing workflow

**Implementation Notes**:
- Should be configured to run on `.tsx` file changes
- Can use @axe-core/react or similar accessibility testing library
- Should respect the project's existing test setup
- Output should be formatted for easy reading in Claude Code

**Example Command**:
```bash
npx axe-playwright --colors ./src/components/ModifiedComponent.test.tsx
```