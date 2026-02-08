# Specification

## Summary
**Goal:** Add a backend `processAdminCommand` function stub that echoes an admin command string without performing any actions.

**Planned changes:**
- Add a new `public shared` function `processAdminCommand(cmd : Text) : async Text` in `backend/main.mo`.
- Implement the function to return exactly `"Command received: " # cmd` with no parsing and no state changes.

**User-visible outcome:** Admin tooling (or developers) can call `processAdminCommand("...")` and receive an echo response like `Command received: ...`.
