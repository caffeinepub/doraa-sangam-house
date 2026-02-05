# Specification

## Summary
**Goal:** Update the backend `requestOtp(identifier : Text)` to generate and store a real 6-digit OTP with a 10-minute expiry and send it via an IC HTTPS outcall to the MSG91 Flow API (using the exact provided outcall code pattern) instead of returning a fake response.

**Planned changes:**
- Modify `backend/main.mo` `requestOtp(identifier : Text)` to generate a random 6-digit OTP, store it in the existing OTP HashMap with an expiry timestamp exactly 10 minutes after `Time.now()`, and (for allowlisted identifiers only) send the OTP via an IC HTTPS outcall to MSG91 using the exact user-provided snippet pattern (URL, placeholder `authkey`/`flow_id`, sender `DORAAH`, request body structure, `Cycles.add`, and `response.status` switch).
- Add any missing imports in `backend/main.mo` required by the new outcall snippet (specifically `Http` and `Cycles`, ensuring `Nat` and `Text` are available) without changing unrelated code.

**User-visible outcome:** When an allowlisted phone number requests an OTP, the backend sends a real SMS OTP via MSG91 and returns “OTP sent successfully” on success (or “SMS send failed: status {code}” on failure); non-allowlisted identifiers are rejected exactly as before.
