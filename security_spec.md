# Security Specification - CMCC Microfinance

## 1. Data Invariants
- A Member must have a unique identifier and a valid type (individual/group).
- A Loan cannot exist without a valid Member ID.
- Transactions must be linked to either an account or a loan.
- Financial transactions are immutable once created (no updates/deletes).
- Only authorized staff can approve loans.
- Timestamps must be server-generated.

## 2. The "Dirty Dozen" Payloads (Denial Expected)
1. **Identity Spoofing**: Attempt to create a member with `createdBy` as another user's UID.
2. **Resource Poisoning**: Create a loan with a 1MB purpose string.
3. **Privilege Escalation**: Update a loan status to 'APPROVED' as a regular loan officer (simulated by checking if UID is in admins).
4. **Orphaned Writes**: Create a loan for a non-existent memberId.
5. **Shadow Fields**: Add `isVerified: true` to a member profile creation.
6. **Timeline Fraud**: Set `createdAt` to a date in the past.
7. **Negative Balance**: Withdraw more than the available balance (complex with rules, but schema should block negative if applicable).
8. **Malicious ID**: Use `../../passwords` as a document ID.
9. **Email Spoofing**: Access admin data using an unverified email.
10. **State Skipping**: Move a loan from 'DRAFT' directly to 'ACTIVE' without approval.
11. **Concurrent Modification**: Change `memberId` on an existing loan.
12. **PII Leak**: List all users and their photos without being logged in.

## 3. Test Runner (Draft Logic)
The rules will be tested against these payloads using the Firestore emulator in a local environment. Since we are in AI Studio, we rely on strict boolean logic gates.
