# Career Copilot — Post-Launch Strategy & Phase 2 Roadmap 🚀

This document outlines the strategic priorities, product expansion phases, monetization architecture, and growth milestones for **Career Copilot** following the completion of the 8-feature MVP.

---

## 📅 Post-Launch Execution Checklist (Week 1)

### Day 1–2: Production Hardening & Soft Launch
- [ ] Configure production telemetry: **Sentry** (exception tracking) & **PostHog/Mixpanel** (event analytics).
- [ ] Verify SSL, CORS origins, and environment variables across frontend & backend.
- [ ] Onboard 20–30 closed beta testers (peers, engineers, college placement leads).
- [ ] Audit critical user flows: Auth, ATS Resume Score, Mock Interview feedback generation, and Job Tracker persistence.
- [ ] Deploy hotfixes for critical edge cases and latency bottlenecks.

### Day 3–4: Community & Organic Distribution
- [ ] Publish soft launch story on **r/developersIndia** (focused on tech interview prep pain points in India).
- [ ] Share on **r/cscareerquestions** and relevant developer Discord/Telegram channels.
- [ ] Publish launch announcements on LinkedIn & X (Twitter) highlighting real CTC benchmarks and ATS feedback.
- [ ] Collect initial feedback and NPS responses via embedded feedback widget.

### Day 5–7: First Iteration Cycle
- [ ] Rank user feedback into: P0 (Bugs), P1 (High-value friction points), P2 (Feature requests).
- [ ] Ship Week 1 patch release addressing top 3 UX hurdles.
- [ ] Document 2–3 early user success stories for social proof.

---

## 🎯 Phase 2: Product & Growth Tracks (Months 2–3)

### Track A: Core Feature Enhancements
1. **AI-Powered Adaptive Personalization**:
   - Machine learning / LLM embeddings to tailor mock interview questions to candidate skill gaps.
   - Dynamic study schedules that recalculate based on daily checklist completion velocity.
   - Predictive weakness detection across DSA, System Design, and Core CS.
2. **Advanced Mock Interview Suite**:
   - Audio/Video response capture with speech pace, filler word, and clarity metrics.
   - Peer mock interview matching via WebRTC.
   - Real-time AI co-pilot hints for coding challenges.
3. **Mobile App (React Native / Expo)**:
   - iOS & Android native companion app.
   - Offline-capable flashcards and revision checklists.
   - Daily push notifications for interview streaks and revision alerts.

### Track B: Monetization & Revenue (Months 2–4)
1. **Tiered Freemium Subscriptions**:
   - **Free**: 1 ATS resume scan/month, 5 text mock interviews, basic job tracker.
   - **Premium (₹799 / $9.99/mo)**: Unlimited ATS scans, unlimited mock interviews, detailed scoring breakdowns, priority AI responses.
   - **Pro (₹1,999 / $24.99/mo)**: Video interview simulations, 1-on-1 mentorship credit, resume rewrite suggestions, salary negotiation coach.
2. **Payment Gateway Integration**:
   - **Razorpay**: Domestic Indian cards, UPI, Netbanking.
   - **Stripe**: International credit cards & global subscription recurring billing.
3. **Institutional / B2B Licensing**:
   - College placement cell and boot camp admin dashboards for bulk cohort readiness tracking.

### Track C: Community & Viral Loops
1. **Peer Networking & Mock Buddy Matching**:
   - Connect candidates targeting similar roles and companies (e.g., SDE-1 at Amazon/Swiggy).
2. **Mentorship Marketplace**:
   - Senior engineers offering 30-minute mock interviews or resume teardowns with integrated scheduling and escrow payments.
3. **Discussion & Experience Forums**:
   - Authentic company interview experience sharing (compensation breakdown, round-by-round question logs).

---

## 📊 Key Operational Metrics & Targets

| Metric | Month 1 Target | Month 2 Target | Month 3 Target | Month 6 Target |
| :--- | :--- | :--- | :--- | :--- |
| **Registered Users** | 1,000 | 5,000 | 20,000 | 100,000 |
| **Daily Active Users (DAU)** | 150 | 800 | 3,500 | 18,000 |
| **Day-30 Retention** | 25% | 35% | 40% | 45% |
| **Paid Conversion Rate** | 0% (Beta) | 3% | 5% | 7% |
| **Monthly Recurring Revenue (MRR)** | ₹0 | ₹1.5L ($2,000) | ₹7.5L ($10,000) | ₹25L ($30,000) |
| **NPS** | >45 | >55 | >65 | >70 |

---

## 🛠️ Prioritized Next Steps for Engineering

1. **Gatekeeping & Subscription Schema**:
   - Add `subscriptionTier`, `subscriptionStatus`, `subscriptionExpiresAt` to `User` model.
   - Add rate-limiting middleware on resource-heavy AI routes (e.g., ATS analysis and mock interview generation).
2. **Telemetry & Error Logging**:
   - Integrate `@sentry/node` and `@sentry/react` for real-time error aggregation.
   - Integrate PostHog / Mixpanel client SDK for conversion funnel analytics.
3. **Payment Webhook Architecture**:
   - Implement idempotent webhook handlers for Razorpay (`order.paid`, `subscription.charged`) and Stripe (`checkout.session.completed`, `customer.subscription.deleted`).
