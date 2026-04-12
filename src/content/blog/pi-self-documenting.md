---
title: "Pi Coding Agent: A Self-Documenting, Extensible AI Partner"
description: "Exploring Pi's ability to read its own documentation, understand its codebase, and help extend or modify its behavior through natural conversation"
pubDate: "2026-04-12"
heroImage: "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/50akj24ratqwzqjsytct.png"
---

> **Meta-lesson**: One of Pi's most powerful features is that you can ask it to explain itself. The agent can read its own documentation, investigate its codebase, and help you extend or modify its behavior—all through natural conversation.

---

## The Scenario: Renaming and Enhancing the "Agent" Tool

In this session, I asked Pi to help rename the "subagent" tool to simply "Agent" and then enhance it with model configuration capabilities. What followed was a perfect demonstration of how Pi operates as a self-documenting system.

### The Initial Request

> **User**: _Configure the subagent extension of pi coding agent such as the tool which "Delegate tasks to specialized subagents with isolated context" to be renamed: "Agent" (including all its references and calls etc.)._

---

## Phase 1: Pi Investigates Its Own Structure

Instead of requiring me to know where files are located, Pi immediately began exploring its own codebase:

### Reading the Documentation

```
📖 Reading: /Users/.../.nvm/.../pi-coding-agent/README.md
```

Pi accessed its own README to understand:

- How extensions are structured
- Where tools are registered
- How the agent system works

### Finding the Extension Files

```bash
find ~/.pi/agent -name "*.ts" -o -name "*.js" 2>/dev/null | head -30
```

Result:

- `/Users/.../.pi/agent/extensions/list-agents.ts`
- `/Users/.../.pi/agent/extensions/subagent/agents.ts`
- `/Users/.../.pi/agent/extensions/subagent/index.ts`

### Reading Extension Documentation

```
📖 Reading: /Users/.../pi-coding-agent/docs/extensions.md
```

This document explained:

> "Extensions are TypeScript modules that extend pi's behavior. They can subscribe to lifecycle events, register custom tools callable by the LLM, add commands, and more."

---

## Phase 2: Understanding the Implementation

Pi read its own extension source code to understand the current implementation:

```
📖 Reading: ~/.pi/agent/extensions/subagent/index.ts
📖 Reading: ~/.pi/agent/extensions/subagent/agents.ts
📖 Reading: ~/.pi/agent/extensions/list-agents.ts
```

From these files, Pi learned:

1. **Tool Registration**: The tool was registered with:
   - `name: "subagent"`
   - `label: "Subagent"`
   - A description mentioning "subagents"

2. **Three Operation Modes**:
   - **Single**: One agent + task
   - **Parallel**: Multiple tasks array
   - **Chain**: Sequential with `{previous}` placeholder

3. **UI Rendering**: Display text using `theme.bold("subagent ")`

4. **Error Messages**: `"Subagent was aborted"`

---

## Phase 3: Executing the Changes

Pi systematically updated all references:

### Tool Registration Changes

- `name: "subagent"` → `name: "agent"`
- `label: "Subagent"` → `label: "Agent"`
- Description updated from "subagents" to "agents"

### UI Display Updates

All `theme.bold("subagent ")` references changed to `theme.bold("agent ")`:

- Chain mode display
- Parallel mode display
- Single agent mode display

### Error Message Update

- `"Subagent was aborted"` → `"Agent was aborted"`

### Documentation Updates

- `list-agents.ts` description updated
- File header comments updated

---

## Phase 4: Debugging (When Things Go Wrong)

After reloading, an error appeared:

> **User**: _After reload we get the following issue: [Extension issues] ParseError: Unexpected token_

Pi's response:

```
📖 Reading: /Users/.../.pi/agent/extensions/subagent/index.ts
```

Found: _"The edit accidentally duplicated the description lines"_

**Fix applied** - duplicate lines removed, file now parses correctly.

---

## Phase 5: Enhancing the Tool (Feature Addition)

Next request:

> **User**: _Investigate if the agent tool can accept model configuration as input via prompt... If it cannot in the current configuration, then adjust it so that it can. The model from input should have priority._

### Investigation Phase

Pi investigated how models are handled:

```bash
grep -n "ctx.model\|modelRegistry" ~/.pi/agent/extensions/subagent/index.ts
```

```bash
grep -n "model" ~/.pi/agent/extensions/subagent/index.ts | head -30
```

Found that the current implementation:

1. Read model from agent markdown file frontmatter
2. Had no input parameter for model override

### The Enhancement

Pi added a `model` parameter to the tool schema:

```typescript
model: Type.Optional(Type.String({
  description: "Model to use (e.g., 'anthropic/claude-sonnet-4-20250514'). Overrides agent's frontmatter model.",
})),
```

Then implemented the priority logic:

1. **First priority**: Model from input parameters
2. **Fallback**: Model from agent markdown frontmatter
3. **Final fallback**: Main agent's running model

The implementation involved:

- Adding `model?: string` to `SingleAgentTask` type
- Modifying `runSingleAgent()` to accept and use the model parameter
- Updating all three execution modes (single, parallel, chain) to pass the model
- Updating the tool description to document the new parameter

---

## Key Insights: Pi as a Self-Documenting System

### 1. **Documentation is Always Available**

Pi has built-in knowledge of its own documentation locations:

```markdown
Pi documentation (read only when the user asks about pi itself):

- Main documentation: ~/.nvm/.../pi-coding-agent/README.md
- Additional docs: ~/.nvm/.../pi-coding-agent/docs
- Examples: ~/.nvm/.../pi-coding-agent/examples
```

### 2. **Extension System is First-Class**

From the docs:

> "Pi ships with powerful defaults but skips features like sub agents and plan mode. Instead, you can ask pi to build what you want or install a third party pi package that matches your workflow."

### 3. **Three-Level Model Fallback System**

The implemented enhancement shows a robust pattern:

```
Input model → Frontmatter model → Main agent model
```

This graceful degradation ensures the tool always works while respecting user preferences.

### 4. **Skills System for Specialized Knowledge**

Pi can load skills from `~/.pi/agent/skills/` that provide specialized instructions. The session shows skills for:

- autofix (CodeRabbit integration)
- changeset-pr (versioning)
- code-review
- frontend-design
- git operations
- and many more...

---

## What This Demonstrates

### You Can Ask Pi About Itself

- "How do I configure extensions?"
- "Where is the documentation for themes?"
- "How do I add a custom tool?"

Pi will read its own docs and explain.

### Pi Can Modify Its Own Code

The agent can:

1. Find its own extension files
2. Read and understand the code
3. Make precise edits
4. Fix errors when they occur

### Extensions Are Powerful

The subagent → Agent tool demonstrates:

- Custom tool registration
- Type-safe parameter schemas (using TypeBox)
- Multiple execution modes (single, parallel, chain)
- UI rendering customization
- Error handling

---

## The Philosophical Point

Pi embodies a different approach to AI tooling. As the documentation states:

> **"Pi is aggressively extensible so it doesn't have to dictate your workflow. Features that other tools bake in can be built with extensions, skills, or installed from third-party pi packages. This keeps the core minimal while letting you shape pi to fit how you work."**

The fact that Pi can:

1. Explain its own architecture
2. Read and modify its own extensions
3. Help you build new capabilities

...makes it a genuinely **self-improving system**.

---

## Try It Yourself

Want to explore Pi's self-documenting capabilities? Try asking:

1. _"Show me how extensions work"_
2. _"How do I create a custom skill?"_
3. _"What tools are currently available and what do they do?"_
4. _"Help me modify the theme/colors"_
5. _"Read the documentation about sessions and explain branching"_

Pi will demonstrate the same pattern: read docs → investigate code → explain → implement if requested.

---

## Conclusion

This session demonstrates something profound: **Pi is an AI system that can understand and modify its own behavior.** It's not a black box—it's a transparent, extensible platform that invites exploration and customization.

The ability to ask "How do I extend you?" and receive a working implementation is a glimpse into a future where AI systems are not just tools, but **collaborative partners** in building the exact workflow you need.

---

**Info about the above described pi session**

_Session date: 2026-04-12_  
_Pi: @mariozechner/pi-coding-agent_  
_Model: mimo-v2-omni via opencode-go_
