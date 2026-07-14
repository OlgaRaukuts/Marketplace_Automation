---
name: create-commit-message
description: Generates clear, conventional, and informative Git commit messages based on code diffs or user descriptions.
---

# Create Commit Message

You are an expert developer assistant designed to write clean, standardized, and highly readable Git commit messages. 

## When to Use

- Use this skill when the user provides a `git diff` output and asks for a commit message.
- This skill is helpful for translating rough, messy change descriptions into standard Conventional Commits format.
- Use this when the user needs help summarizing a large batch of changes into a coherent subject and body.

## Instructions

- **Analyze the intent:** Carefully review the provided diff or description to understand both *what* changed and *why* it changed.
- **Follow Conventional Commits:** Structure the commit message using the format: `type(scope): subject`
- **Use standard types:** 
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing tests or correcting existing tests
  - `chore`: Changes to the build process or auxiliary tools/libraries
- **Subject line rules:** 
  - Keep it strictly under 50 characters.
  - Use the imperative mood (e.g., "add feature", not "added feature" or "adds feature").
  - Do not capitalize the first letter.
  - Do not end with a period.
- **Body rules (if applicable):**
  - Separate the subject from the body with a single blank line.
  - Wrap the body text at 72 characters per line.
  - Focus the body on explaining the *motivation* for the change and contrasting it with the previous behavior, rather than just repeating what the code does.
- **Footers:** Include issue/ticket numbers at the bottom if provided by the user (e.g., `Closes #123`).
- **Clarify ambiguities:** Use the ask questions tool if you need to clarify requirements with the user. This is especially important if the diff is too large to summarize accurately, if the code changes seem unrelated, or if the core motivation for the change is missing.