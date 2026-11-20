# Happy Hangouts — Firestore Security Specification & Red Team Audit

## 1. Data Invariants
1. **Identity Integrity (`users`)**: A user document at `/users/{userId}` can only be created or read by the authenticated owner (`request.auth.uid == userId`) or a verified admin (`isAdmin()`). Self-assigned `'admin'` roles, `kycVerified: true`, or resetting `freeHangoutUsed` on client writes are blocked.
2. **PII Isolation**: Private contact info (`email`, `phone`, `emergencyContact`, `govtIdLast4`) resides exclusively inside `/users/{userId}` and booking documents restricted to booking participants (`seekerUid`, `partnerUid`) and `isAdmin()`. Public/catalog `/partners/{partnerId}` documents contain zero email or phone PII.
3. **Women-Only Integrity (`bookings`)**: If `womenOnly == true`, the incoming booking MUST have `seekerGender == 'female'` and `womenOnlyConfirmed == true`.
4. **Fixed Pricing Integrity**: `standardPriceInr` must strictly be `199` (`30m`), `299` (`1h`), or `499` (`2h`). Partner payout is strictly `0` (on 1st free hangout) or `159` / `239` / `399` (80%).
5. **Terminal State Locking**: Once a booking reaches `'declined'`, `'completed'`, `'cancelled'`, or `'expired'`, non-admin users cannot mutate its state.
6. **Temporal Integrity**: `createdAt` on create and `updatedAt` on update must equal `request.time`.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unverified Admin Email Spoof**: Request with `email == 'mubaarqaan@gmail.com'` and `email_verified == false` -> Denied by `email_verified == true`.
2. **Self-Privilege Escalation on Create**: User creates `/users/{uid}` with `role: "admin"` -> Denied (`role in ['seeker', 'partner']`).
3. **Self-KYC Bypass on Create/Update**: User writes `kycVerified: true` or resets `freeHangoutUsed: false` -> Denied by create check and immutable field diff check.
4. **Shadow Ghost Field Injection**: Payload adds `isSuperUser: true` to `/bookings/{id}` -> Denied by `data.keys().hasOnly(...)`.
5. **ID Poisoning**: Document ID > 128 chars or containing `/`, `.`, spaces -> Denied by `isValidId()`.
6. **PII Scraping (`allow list` on `/users`)**: Non-admin user calls `getDocs(collection(db, 'users'))` -> Denied by `resource.data.uid == request.auth.uid`.
7. **Booking Owner Spoofing**: Attacker creates booking with `seekerUid: "victim_uid"` -> Denied (`incoming().seekerUid == request.auth.uid`).
8. **Invalid Pricing Manipulation**: Booking payload sets `standardPriceInr: 1` or `partnerPayoutInr: 5000` -> Denied by strict duration-price check.
9. **Women-Only Bypass**: Male seeker (`seekerGender: "male"`) attempts booking with `womenOnly: true` -> Denied.
10. **Terminal Booking Tampering**: User tries to change `'completed'` booking back to `'pending'` -> Denied by terminal state lock.
11. **Timestamp Forgery**: Client passes past or future `createdAt` instead of `serverTimestamp()` (`request.time`) -> Denied.
12. **Cross-Participant Read**: Third-party user tries `getDoc` on another user's `/bookings/{id}` -> Denied.
