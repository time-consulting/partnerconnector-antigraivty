# Overview

PartnerConnector is a professional referral platform for accountants, business consultants, and financial advisors. Its primary purpose is to facilitate the referral of payment processing solutions to clients, enabling partners to earn commissions. The platform aims to be a comprehensive tool for managing referrals, tracking commissions, and providing robust support for its users.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript, utilizing a component-based architecture. Key technologies include:
- **UI Framework**: React 18 with TypeScript.
- **Styling**: Tailwind CSS with shadcn/ui for consistent design.
- **Routing**: Wouter for client-side routing.
- **State Management**: TanStack Query for server state management.
- **Form Handling**: React Hook Form with Zod validation.
- **Build Tool**: Vite for development and production builds.

## Backend Architecture
The backend is a RESTful API developed with Express.js and TypeScript, designed for scalability and maintainability.
- **Framework**: Express.js with TypeScript.
- **Database ORM**: Drizzle ORM for type-safe database operations.
- **Authentication**: Replit Auth with OpenID Connect.
- **Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple.
- **File Handling**: Multer for file uploads.

## Database Design
A PostgreSQL database underpins the application, featuring core entities such as:
- **Users**: User profiles, including onboarding status, GDPR/marketing consent, and authentication security fields (emailVerified, verificationToken, passwordResetToken, passwordResetExpires, loginAttempts, lockoutUntil, lastLogin).
- **Referrals**: Tracks submitted referrals, their status, and associated information.
- **Quotes**: Manages quotes sent from Dojo, including customer journey status.
- **Business Types**: Categorization of businesses for commission calculations.
- **Bill Uploads**: Stores client payment processing bills.
- **Commission Payments**: Records commission payouts to users.
- **Sessions**: Stores user session data.
- **Partner Hierarchy**: Tracks multi-level marketing (MLM) relationships and commission structures.

## Authentication & Authorization
- **Provider**: Custom email/password authentication with GoHighLevel email integration.
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple.
- **Route Protection**: Middleware-based checks for secure access.
- **User Management**: Automatic user creation and updates upon successful authentication, with a mandatory 3-step onboarding flow for new users.
- **Security Features**:
  - Email verification required for all new accounts
  - Password strength requirements (min 8 chars, at least 1 letter + 1 number)
  - Rate limiting: 5 failed login attempts trigger 15-minute account lockout
  - Secure password reset with token expiration (1 hour)
  - Password hashing with bcrypt (12 rounds)
  - Verification email resend capability

## File Upload System
- **Storage**: In-memory with Multer (10MB limit).
- **Security**: File type and size validation.
- **Association**: Files are linked to specific referrals.

## UI/UX Decisions
- **Design Language**: Inspired by Dojo.tech, featuring rounded cards, clear action buttons, and professional typography.
- **Mobile-First Approach**: Responsive design across all components, including a mobile-optimized referral form and quick add lead capture.
- **Dashboard Redesign**: Three distinct sections: Hero Overview, Action Hub, and Engagement Feed.
- **Navigation**: Desktop side navigation (expandable) and mobile hamburger menu.
- **Referral Form Redesign**: Streamlined 3-stage mobile-first flow without an earnings preview sidebar.
- **Admin Portal**: Streamlined two-tab structure: (1) Quote Requests showing new submissions with comprehensive details (business info, current processor, products, funding), (2) Deal Management Pipeline with progression stages. Removed duplicate quote request subtab for clarity.
- **Training System**: Gamified learning hub with progression (Bronze to Platinum Partner), achievement badges, and learning streaks.
- **Referral Status**: Default status changed from 'pending' to 'submitted' to ensure new referrals appear immediately in Quote Requests tab.
- **Partner Pipeline Tabs (Track Deals page)**: 9-tab structure with grouped stages:
  1. All Deals
  2. Submitted (submitted, quote_request_received)
  3. Quote Received (quote_sent)
  4. Application Submitted (signup_submitted, agreement_sent, signed_awaiting_docs, under_review) - requires signupCompletedAt
  5. In Progress (agreement_sent, signed_awaiting_docs, under_review)
  6. Approved (Dojo) - only shows Dojo-approved deals
  7. Live (live_confirm_ltr)
  8. Complete (invoice_received, completed)
  9. Declined

## Features and Functionality
- **Quotes Management**: View, approve, question, request rate changes, and send quotes to clients.
- **Onboarding System**: Mandatory multi-step onboarding for new users.
- **Team Tracking & MLM**: Referral code generation, hierarchical team linking (L1=60%, L2=20%, L3=10% commissions), and real-time team analytics.
- **Admin Portal**: Streamlined dashboard with single Quote Requests tab (status='submitted'), Deal Management Pipeline with 7 subtabs (Sent Quotes, Sign Up, Docs Out, Awaiting Docs, Approved, Complete, Declined), CSV export, analytics, and system settings.
- **Mobile Engagement**: Real-time notifications via WebSockets, quick add form, push notifications via Web Push API, PWA support with offline mode, and voice input.
- **Authentication System**: 
  - Custom login/signup with email verification
  - Password reset flow with secure tokens
  - Rate limiting and account lockout protection
  - Resend verification email capability
  - Password strength validation
- **Contact Form**: Full-width dialog for enhanced desktop experience.

## Accounting Integrations
The platform now supports integration with accounting software for automated invoice and contact syncing:
- **QuickBooks**: Connect via OAuth2 for contact sync, invoice creation, and payment tracking
- **Xero**: OAuth2 integration for contact sync, invoice sync, and bank reconciliation
- **Sage**: Connect for UK business accounting integration
- **FreshBooks**: Cloud accounting integration for client management and invoicing

The integrations are managed via the `/integrations` route with a dark tech theme UI. OAuth credentials must be configured via environment variables (`<PROVIDER>_CLIENT_ID`, `<PROVIDER>_CLIENT_SECRET`) to enable connections.

# External Dependencies

## Database Services
- **PostgreSQL**: Primary database provided by Neon serverless PostgreSQL.
- **Drizzle ORM**: Database toolkit for PostgreSQL.
- **@neondatabase/serverless**: For optimized connection pooling.

## Authentication Services
- **Replit Auth**: OpenID Connect authentication provider.
- **connect-pg-simple**: For PostgreSQL-backed session storage.

## Development Tools
- **Replit Integration**: Cartographer and runtime error modal plugins.
- **ESBuild**: For server bundling.
- **Vite**: For client bundling.
- **TypeScript**: For type safety across the stack.

## UI Components & Styling
- **Radix UI**: Headless component primitives for accessibility.
- **Tailwind CSS**: Utility-first CSS framework.
- **shadcn/ui**: Pre-built component library.
- **Lucide React**: Icon library.

## Utility Libraries
- **Zod**: For runtime type checking and form validation.
- **date-fns**: For date manipulation.
- **clsx** and **tailwind-merge**: For conditional styling.
- **TanStack Query**: For server state synchronization.