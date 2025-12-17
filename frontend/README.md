## SorSU Clinic Management – Frontend

This folder contains the **Next.js frontend** for the SorSU Clinic Management System: all UI components, client-side hooks, and shared helpers used by the `app` router.

---

### Folder Architecture

- **Root app (Next.js)** – lives at repository root, but is logically part of the frontend
  - `app/layout.tsx` – root layout (HTML shell, fonts, global styles)
  - `app/page.tsx` – landing page / root route
  - `app/(auth)/*` – authentication pages (`/login`, `/signup`)
  - `app/(dashboard)/*` – main application UI (dashboard, patients, visits, contacts, profile, monitoring)
  - `app/api/*` – server routes used by the frontend (documented in the backend README)
- **`frontend/components`**
  - `header.tsx` – top navigation with profile menu and sign‑out
  - `layout-wrapper.tsx` – main shell layout (header + sidebar + page content)
  - `sidebar.tsx` – left navigation for dashboard sections
  - `theme-provider.tsx` – theme context (light/dark, Tailwind integration)
  - `components/ui/*` – reusable UI primitives and building blocks (see below)
- **`frontend/hooks`**
  - `use-database-init.ts` – client hook that hits `/api/patients` once to ensure the DB and Prisma schema are initialized for the current user
  - `use-mobile.ts` – responsive utilities for detecting and handling mobile layouts
  - `use-toast.ts` – hook for showing toasts using the shared toast system
- **`frontend/lib`**
  - `auth.ts` – simple validation helpers (password/email/phone) and user type definitions
  - `constants.ts` – role permission matrix and helpers for `getCurrentUser`, `setCurrentUser`, `removeCurrentUser`
  - `utils.ts` – generic utilities: `cn` className helper and `logActivity` for sending actions to `/api/activities`

---

### Components List (High‑Level)

- **Layout & Navigation**
  - `LayoutWrapper` – wraps pages with header and sidebar
  - `Header` – profile avatar, profile link, and sign‑out action
  - `Sidebar` – navigation links to Dashboard, Patients, Visits, Contacts, Monitoring, Profile

- **Feedback & Overlay**
  - `Alert`, `AlertDialog` – inline and modal alerts/confirmations
  - `Dialog`, `Drawer`, `Sheet` – modal dialogs, drawers, and side sheets
  - `Toast`, `Toaster`, `use-toast` – global toast notification system
  - `Tooltip`, `HoverCard`, `Popover` – informational overlays
  - `Skeleton`, `Spinner` – loading states and placeholders

- **Form & Input Primitives**
  - `Button`, `ButtonGroup`, `Toggle`, `ToggleGroup`, `Switch`
  - `Input`, `Textarea`, `InputOTP`, `InputGroup`
  - `Checkbox`, `RadioGroup`, `Select`
  - `Label`, `Field`, `Form` – accessible form layout helpers
  - `Calendar` – date picker (used for DOB and visit dates)

- **Data Display & Layout**
  - `Card`, `Table`, `Badge`, `Avatar`, `Breadcrumb`
  - `Tabs`, `Accordion`, `Collapsible`
  - `Pagination`, `Progress`
  - `ScrollArea`, `Resizable`, `Separator`
  - `Empty` – standardized “no data” state

- **Dashboard‑specific UI**
  - Components above are composed in:
    - `app/(dashboard)/dashboard/page.tsx` – statistics and activity feed
    - `app/(dashboard)/patients/page.tsx` – patient CRUD and detail views
    - `app/(dashboard)/visit-records/page.tsx` – visit histories
    - `app/(dashboard)/contacts/page.tsx` – personal and clinic contacts
    - `app/(dashboard)/monitoring/page.tsx` – monitoring views
    - `app/(dashboard)/profile/page.tsx` – user profile management

---

### Libraries & Frameworks Used (Frontend)

- **Framework & Runtime**
  - **Next.js 16** – React framework with the App Router and built‑in API routes.
  - **React 19** – UI component model and hooks.

- **Styling & Theming**
  - **Tailwind CSS 4** – utility‑first CSS styling.
  - **tailwind-merge** – intelligent className merging via the `cn` helper.
  - **next-themes** – theme switching (e.g., dark/light modes).

- **UI & UX**
  - **Radix UI** (`@radix-ui/react-*`) – accessible headless components used to build dialogs, dropdowns, popovers, tooltips, etc.
  - **lucide-react** – icon set used throughout the dashboard.
  - **sonner** – toast notification system used by `use-toast`.
  - **embla-carousel-react** – carousel/slider utilities when needed.

- **Forms & Validation**
  - **react-hook-form** – form state management and validation wiring.
  - **zod** & `@hookform/resolvers` – schema-based validation (where used).

- **Date & Charts**
  - **date-fns** – formatting and manipulating dates (DOB, visit dates, etc.).
  - **recharts** – chart components if visual analytics are needed.

The frontend talks to the backend exclusively via the `app/api/*` routes (e.g., `/api/patients`, `/api/visits`, `/api/activities`), passing the current user via the `x-user-id` header.


