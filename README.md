# Mboa Property Group

Property management platform connecting tenants, landlords, and administrators in Cameroon.

## Features

- **Role-Based Access**: Admin, Tenant, and Landlord dashboards
- **Issue Reporting**: Tenants report property issues with urgency and category
- **Issue Workflow**: New -> Reviewed -> Landlord Notified -> Repair In Progress -> Resolved -> Closed
- **Real-Time Messaging**: Per-issue message threads between admin, tenants, and landlords
- **Notifications**: In-app + WhatsApp (Twilio) + Email (Resend) notifications
- **Property Management**: Admin manages properties, units, and tenant/landlord assignments
- **Bilingual Support**: French and English notification messages based on user preference

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Convex (real-time database, auth, file storage)
- **Auth**: Convex Auth with Password provider
- **WhatsApp**: Twilio WhatsApp Business API
- **Email**: Resend email API

## Getting Started

### Prerequisites

- Node.js 18+
- A Convex account (https://convex.dev)

### Setup

```bash
# Install dependencies
npm install

# Set up Convex (follow the prompts to create a project)
npx convex dev

# In a separate terminal, start the Next.js dev server
npm run dev
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```
# Convex
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Twilio (WhatsApp) - get from https://console.twilio.com
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=+14155238886

# Resend (Email) - get from https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Mboa Property <notifications@yourdomain.com>
```

Note: Set Twilio and Resend env vars in your **Convex dashboard** (Settings > Environment Variables), not in `.env.local`, since they're used by Convex server-side actions.

## Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Manage properties, units, tenants, landlords. Review issues, update statuses, message all parties |
| **Tenant** | View assigned unit, report issues, track issue status, message admin |
| **Landlord** | View owned properties, see assigned issues, acknowledge repairs, message admin |

The first user to register automatically becomes the Admin.
