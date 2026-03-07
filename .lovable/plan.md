

# FundBridge — Investment & Revenue Sharing Platform (Updated)

**Tagline:** *"Bridging Businesses with Smart Capital"*

---

## 🎨 Design Direction
- Dark navy + gold/amber accent palette, fintech-inspired
- **Inter** (body) + **Playfair Display** (headings) for premium feel
- Glass-morphism cards, subtle gradients, trust-building UI (badges, verification icons, progress bars)
- Fully responsive (desktop, tablet, mobile)

---

## 🏠 Public Pages

### 1. Landing Page
- Hero with tagline + dual CTAs ("List Your Business" / "Start Investing")
- Platform stats (businesses funded, total investment, investors)
- How It Works (3-step flow)
- Featured approved businesses carousel
- Testimonials & footer with newsletter signup

### 2. Explore Businesses
- Grid/list toggle, search bar
- Filters: industry, location (BD/Global), funding goal, revenue share %
- Cards show: name, logo, industry, funding progress, revenue %, location, **verified badge**
- Only **admin-approved** businesses appear here

### 3. Business Detail Page
- Full company overview, team, pitch description
- Financials: revenue, growth, projected returns
- Revenue sharing terms & investment tiers
- Funding progress tracker
- "Invest Now" CTA
- Q&A section

### 4. Static Pages
- About Us, How It Works, FAQ, Contact, Terms & Privacy

---

## 🔐 Authentication & Roles
- Email signup/login with role selection: **Investor**, **Business Owner**
- Roles stored in separate `user_roles` table (secure, no privilege escalation)
- Admin role assigned manually (not selectable at signup)
- Profile management for all users

### 📍 Location Selector (Navbar)
- Toggle between **Bangladesh 🇧🇩** and **Global 🌍** — filters all listings

---

## 📋 Business Owner Experience

### Business Onboarding (Comprehensive Application)
Founders must provide **extensive, quality information** to be approved. Multi-step form:

1. **Company Basics** — Name, logo, industry, location, founding date, website
2. **Team & Leadership** — Founder bios, team members, LinkedIn profiles, experience
3. **Business Description** — Detailed pitch, problem being solved, target market, competitive advantage
4. **Financial Information** — Current revenue, expenses, growth rate, profit margins, financial projections (with supporting documents)
5. **Revenue Sharing Terms** — Proposed share %, investment tiers, payout frequency, minimum/maximum investment
6. **Legal & Documents** — Business registration, tax ID, trade license, bank statements, pitch deck upload
7. **Review & Submit** — Summary of all info, agreement to terms, submit for admin review

**Status after submission:** "Pending Review" — business is NOT listed until admin approves.

### Business Owner Dashboard
- Application status tracker (Pending → Under Review → Approved / Rejected with feedback)
- Edit/update listing (resubmission triggers re-review)
- Funding progress & analytics (views, investor interest)
- Investor communications
- Revenue report submissions

---

## 💼 Investor Experience

### Investor Dashboard
- Portfolio overview: invested companies, total invested, expected returns
- Revenue share earnings tracker
- Investment history
- Watchlist / saved businesses
- Notifications (new listings, revenue payouts, updates)

---

## 🛡️ Admin Panel

A full admin control center accessible only to admin-role users:

### Dashboard Overview
- Platform-wide stats: total users, businesses listed, pending applications, total investments, revenue generated
- Recent activity feed

### Business Management
- View all business applications (Pending, Approved, Rejected)
- **Review application details** — see all submitted info, documents, financials
- **Approve or Reject** with feedback/comments to the founder
- Flag or suspend listings
- Edit/override listing details if needed

### Investor Management
- View all registered investors
- See investment activity per investor
- Flag or suspend investor accounts

### User Management
- View all users with roles
- Search and filter users
- Deactivate/ban accounts

### Investment Monitoring
- Track all investments across the platform
- View investment flow: who invested in what, how much, when
- Revenue sharing payment tracking

### Reports & Analytics
- Platform growth charts (users, investments, businesses over time)
- Top performing businesses
- Flagged or concerning activity alerts

---

## 🔧 Backend (Lovable Cloud / Supabase)
- **Auth**: Email signup with role management (investor, business_owner, admin)
- **Database Tables**: profiles, user_roles, businesses (with approval status), investments, watchlists, notifications, admin_reviews
- **Row-Level Security**: Strict policies — users see own data, public sees only approved listings, admins access all
- **Storage**: Logos, documents, pitch decks, financial files
- **Security Definer Functions**: `has_role()` for safe admin checks without RLS recursion

