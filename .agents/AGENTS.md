# Agent Constraints

- **Strict Step-by-Step Execution**: You must ONLY perform the specific task requested by the user in their latest prompt.
- **No Self-Initiated Steps**: Do not proceed to subsequent implementation phases, write additional files, or run follow-up commands (like starting development servers or installing additional components) unless the user explicitly tells you to do so in the active prompt.
- **Stop and Check**: After completing a single file edit or logical task, stop execution, explain what you did, and wait for instructions on what to do next.
