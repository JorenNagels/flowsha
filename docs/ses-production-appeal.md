# SES production-access — escalation draft

Context: production-access request (case `178080788200578`) was denied twice with the
generic boilerplate ("negative impact / security purposes / no specific details"), and
the case is now **permanently closed** (14 days inactivity) — it cannot be reopened, and
the SES API refuses to resubmit while the account's review state is DENIED
(`put-account-details` → `ConflictException`). So the only route is a **related case**
via the console. This draft forces the reviewer to give the specific basis rather than
re-arguing the use case.

How to file:
1. AWS Support Center (console region **eu-west-2 / London**) → open the closed case
   `178080788200578` → **Create related case** (or Create case → Service limit increase).
2. Limit type **SES Sending Limits**, Region **EU (London) eu-west-2**, mail type
   **Transactional**, website `https://flowsha.co.uk`.
3. Paste the body below into the case description. Keep it factual and calm.

---

Subject: Request for specific basis of SES production-access denial (case 178080788200578)

Hello,

Our SES production-access request for this account (EU London / eu-west-2, case
178080788200578) was denied on 2026-06-08 with the response that our use "could have a
negative impact" and that specific details cannot be shared for security reasons. We
would like to understand and resolve the concern, so we are requesting the specific
policy basis for the denial.

For reference, our sending is deliberately minimal and low-risk:

- **Transactional only.** Flowsha is a small hula-hoop classes / performances / handmade-
  hoops business in Southampton, UK (https://flowsha.co.uk). We operate a single website
  contact form. Each submission sends exactly two emails: (1) a notification to our own
  business inbox, and (2) a confirmation/auto-reply to the person who just submitted the
  form. No marketing, newsletters, or bulk mail.
- **Volume.** At most a handful of emails per day, triggered only by a form submission.
  Nothing scheduled or recurring.
- **Recipient lists.** None. We only email (a) the address a person just typed into the
  form and (b) our own inbox. Single opt-in, entirely user-initiated. No purchased,
  rented, or imported contacts.
- **Deliverability & feedback.** Sending domain `flowsha.co.uk` is verified with DKIM
  (status: success), custom MAIL FROM aligned for SPF, and DMARC published. Feedback
  forwarding is on; bounces/complaints go to a monitored inbox and any offending address
  is suppressed and investigated before any further send. Expected bounce/complaint rates
  are near zero because we only send to an address the recipient just entered, and to our
  own inbox.

Given the above, we cannot identify what negative impact is anticipated. Could you please
either (a) point to the specific Acceptable Use Policy or Service Terms provision at
issue so we can address it directly, or (b) advise what additional evidence would allow
production access to be granted. We are happy to provide anything further.

Thank you.
