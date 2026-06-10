# Security Specification: Academic Pathway Engine

## 1. Data Invariants
- Submissions are immutable once created. No updates or deletions are permitted by clients.
- Creating a submission requires all fields to be valid and within range constraints:
  - `full_name` must be a string between 2 and 150 characters.
  - `email` must be a valid email format under 150 characters.
  - `qualification` must be one of: "High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD".
  - `experience` must be an integer between 0 and 100.
  - `profession` must be a string under 200 characters.
  - `career_goal` must be a string under 1000 characters.
  - `recommendation` must be a valid recommended path.
  - `reason` must be a string under 2000 characters.
  - `created_at` must match the server timestamp `request.time`.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
We enforce that all the following payloads return `PERMISSION_DENIED`:
1. **Unsigned-in Attempt to Delete**: Trying to delete a submission.
2. **Unsigned-in Attempt to Update**: Trying to edit academic recommendation or pathway details of a submission.
3. **Ghost Field Modification**: Sending extra fields like `is_approved: true` in submission payload.
4. **Invalid Email Format**: email set to `invalid-email-no-at-sign` or a 1MB string.
5. **No Name Field**: Creating a submission without providing `full_name`.
6. **Out-of-bound Work Experience**: Setting work experience to `-5` or `120`.
7. **Invalid Qualification Enum**: qualification set to "None" or "Kindergarten".
8. **Client Timestamp Override**: Sending `created_at` matching a fake past timestamp rather than `request.time`.
9. **Junk Characters ID Poisoning**: Trying to write with document ID containing 1.5KB of non-alphanumeric characters.
10. **Huge Reason field Injection**: Sending a `reason` containing 1MB of text (Denial of Wallet).
11. **Spoofed Admin status**: Attempting to bypass validations using spoofed user claims.
12. **Blanket Query Scraping**: Attempting to query across users with an unconstrained query if private fields are added (since this app is designed to list submissions transparently, listings are restricted to the default limit).

## 3. Test Rules Architecture
The Firestore security rules will block all updates, deletions, and any invalid creations. Only valid document structured creations are allowed.
