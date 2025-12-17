## SorSU Clinic Management – Backend

This folder contains the **backend infrastructure** for the SorSU Clinic Management System: Prisma models, migrations, and the shared database client used by Next.js API routes in `app/api`.

---

### Backend Folder Structure

- **`backend/lib`**
  - `db.ts` – singleton Prisma client used by all API route handlers:
    - Imports `PrismaClient` from `@prisma/client`.
    - Configures logging (verbose in development, errors in production).
    - Ensures a single Prisma instance across hot‑reloads via `globalThis`.

- **`backend/prisma`**
  - `schema.prisma` – main database schema (SQLite) defining all domain models.
  - `migrations/*` – generated Prisma migrations that evolve the schema:
    - `add_username`, `add_clinic_contact`, `update_patient_schema`,
      `add_medical_history_and_emergency_contacts`, `add_email_to_patient`, etc.
  - `prisma/dev.db` – SQLite database file for local development.

- **`backend/init-db.js`**
  - Tiny Node.js script that runs `npx prisma migrate deploy` to apply all migrations.
  - Can be called once during setup to ensure the local database is up to date.

> Note: Controllers (route handlers) live under `app/api/*` in the project root.
> They import the database client via the alias `@/lib/db`, which is mapped to `backend/lib/db.ts` in `tsconfig.json`.

---

### Main Controllers / Services (Next.js API Routes)

All controllers are implemented as **Next.js Route Handlers** under `app/api` and run on the server:

- **Authentication (`app/api/auth/*`)**
  - `POST /api/auth/signup`
    - Validates required fields: `username`, `email`, `password`, `fullName`.
    - Ensures `username` and `email` are unique.
    - Hashes the password with `bcryptjs`.
    - Creates a new `User` (currently with role `admin`) and returns user data without the password.
  - `POST /api/auth/login`
    - Accepts `usernameOrEmail` + `password`.
    - Finds a user by `username` or `email`.
    - Verifies the password via `bcrypt.compare`.
    - Returns user data on success, or 401 on invalid credentials.
  - `POST /api/auth/check-username`
    - Validates a proposed `username`.
    - Returns `{ available: boolean }` depending on whether a `User` with that username exists.

- **Patients (`app/api/patients/route.ts`)**
  - **Authentication:** all methods require an `x-user-id` header matching a `User.id`.
  - `GET /api/patients`
    - Returns all `Patient` records for the current user, ordered by `createdAt desc`.
  - `POST /api/patients`
    - Validates patient personal info, role‑specific fields, and emergency contacts.
    - Normalizes numeric fields (e.g., `yearLevel`, `block`) and date of birth.
    - Creates a new `Patient` linked to the calling user (`userId`).
  - `PUT /api/patients`
    - Same validation rules as POST.
    - Updates an existing `Patient` scoped to the current `userId`.
  - `DELETE /api/patients`
    - Deletes a `Patient` by `id`, ensuring it belongs to the current user.

- **Visits (`app/api/visits/route.ts`)**
  - `GET /api/visits`
    - Returns all `VisitRecord` rows for the current user.
    - Includes related `Patient` (name fields) and `User` (fullName).
  - `POST /api/visits`
    - Creates new visit records, either linked to an existing `Patient` or as a walk‑in (`visitorName`).
    - Validates required fields (`visitDate`, `reason`, `symptoms`, `treatment`) and patient ownership.
  - `PUT /api/visits`
    - Updates existing visits, enforcing that the record belongs to the current user.
    - Validates any changed `patientId` as belonging to the same user.
  - `DELETE /api/visits`
    - Deletes a visit record by `id`, scoped to the current `userId`.

- **Contacts (`app/api/contacts/route.ts`)**
  - `GET /api/contacts` – list personal contacts for the authenticated user.
  - `POST /api/contacts` – create a new `Contact` (name, phone, email, relationship).
  - `PUT /api/contacts` – update an existing contact (ownership enforced).
  - `DELETE /api/contacts` – delete a contact for the current user.

- **Clinic Contacts (`app/api/clinic-contacts/route.ts`)**
  - `GET /api/clinic-contacts` – list saved clinic/organization contacts (name, icon, link, notes).
  - `POST /api/clinic-contacts` – create a new `ClinicContact` for the user.
  - `PUT /api/clinic-contacts` – update a clinic contact (authorized by `userId`).
  - `DELETE /api/clinic-contacts` – delete a clinic contact.

- **Activities (`app/api/activities/route.ts`)**
  - `GET /api/activities` – fetch the latest activities (default: last 10) for the current user.
  - `POST /api/activities` – create an `Activity` entry (type + message) for audit logging.

- **User Profile (`app/api/users/profile/route.ts`)**
  - `GET /api/users/profile` – fetches the logged‑in user profile (without the `role` field).
  - `PUT /api/users/profile` – updates profile fields (`fullName`, `email`, `phone`, `address`, `avatar`) for the current user.

All controllers rely on the `x-user-id` header to scope data to the authenticated `User`, and they use the shared Prisma client from `backend/lib/db.ts`.

---

### Database Schema Overview (`backend/prisma/schema.prisma`)

The backend uses **SQLite via Prisma** with the following main models:

- **User**
  - Core authentication and profile entity.
  - Fields: `id`, `username` (unique), `email` (unique), `password` (hashed), `fullName`, `role`, `phone`, `address`, `avatar`, timestamps.
  - Relations: has many `Activity`, `ClinicContact`, `Contact`, `Patient`, and `VisitRecord` rows.

- **Patient**
  - Represents a clinic patient or staff member.
  - Personal info: names, `dateOfBirth`, `gender`, `phone`, optional `email` and `address`.
  - School/employment info: `role` (`student`, `teaching_staff`, `non_teaching_staff`), `idNumber`.
  - Student fields: `program` (CICT/CBME), `course`, `yearLevel`, `block`.
  - Teaching staff fields: `department`.
  - Non‑teaching staff fields: `staffCategory`.
  - Medical history: `pastIllnesses`, `surgeries`, `currentMedication`, `allergies`, `medicalNotes`.
  - Emergency contacts: primary & secondary names, relationships, phones, and addresses.
  - Attachments: optional `attachments` string (typically JSON or file URLs).
  - Relations: belongs to a `User` via `userId`; has many `VisitRecord` entries.

- **Contact**
  - Personal contact (e.g., family member, guardian).
  - Fields: `name`, `phone`, `email`, optional `relationship`, timestamps.
  - Relation: belongs to a `User` (`userId`).

- **ClinicContact**
  - Saved clinic or external service contacts (e.g., hospitals, departments).
  - Fields: `name`, `icon`, `link`, optional `notes`, timestamps.
  - Relation: belongs to a `User` (`userId`).

- **Activity**
  - Audit trail of user actions (e.g., “Patient X was added”, “Visit Y updated”).
  - Fields: `type` (e.g., `visit`, `patient`, `action`), `message`, `userId`, `createdAt`.
  - Relation: belongs to a `User`.

- **VisitRecord**
  - Clinic visit record, optionally tied to a `Patient`.
  - Fields: `patientId` (nullable), `visitorName` (for walk‑ins), `userId`, `visitDate`, `reason`, `symptoms`, `treatment`, optional `notes`, timestamps.
  - Relations: belongs to `User`, and optionally to `Patient` (with cascade on delete).

Together, these models support user accounts, detailed patient records, emergency contacts, visit histories, and activity logging for the SorSU Clinic Management System.


