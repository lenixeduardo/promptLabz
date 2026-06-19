# supabase-migration

Generate Supabase migration scripts with validation and testing

## When to Invoke

Use this skill when you need to:
- Create new database migrations for Supabase
- Modify existing database schema
- Add new tables, columns, or relationships
- Update RLS policies
- Generate test data for migrations

## How It Works

This skill generates Supabase migration SQL files with:
- Proper migration naming convention (timestamp-prefixed)
- Up and down migration scripts
- Validation checks
- Comments explaining the purpose
- Template for test data insertion (when applicable)

## Implementation

When invoked, the skill will:
1. Ask for migration description
2. Determine migration type (create table, alter table, etc.)
3. Generate appropriate SQL structure
4. Add validation and safety checks
5. Follow Supabase migration best practices

## Example Usage

```
/supabase-migration add-user-preferences-table
/supabase-migration add-index-to-prompts-table
/supabase-migration update-rls-policies
```

## Output

Creates a new file in `supabase/migrations/[timestamp]-[description].sql` with:
- Up migration (CREATE/ALTER statements)
- Down migration (DROP/REVERT statements)
- Comments explaining the migration purpose
- Safety checks where applicable
- Template for inserting test data (in up migration)