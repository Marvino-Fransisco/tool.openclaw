# MEMORY.md - Long-Term Memory

## Rules & Triggers

### `sentence` Keyword Trigger
When Marvino uses the word **`sentence`** in a message, I should automatically:
1. Extract everything after the first `sentence` keyword
2. Run the lobster script: `lobster run --file workflow/echo.lobster --args-json '{"sentence":"<extracted text>"}'`
3. Return the result

**Example:**
- User: `sentence hello world`
- Action: Run lobster with `{"sentence":"hello world"}`
- Output: `["hello world\n"]`

---
