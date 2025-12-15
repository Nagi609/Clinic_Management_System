# Patient Management System - Major Update

## Overview
The patient management system has been completely redesigned to support a school clinic with patient classification (students, teaching staff, non-teaching staff) and role-specific information.

## Database Changes (Prisma Schema)

### Patient Model - New Fields
The Patient model has been updated with the following structure:

**Personal Information:**
- `firstName` (String, required) - Letters only
- `middleName` (String, optional) - Letters only
- `lastName` (String, required) - Letters only
- `suffix` (String, optional) - e.g., Jr., Sr.
- `dateOfBirth` (String, required) - ISO date format
- `gender` (String) - Male or Female
- `phone` (String, required) - Format: 09xxxxxxxxx (11 digits, must start with 09)
- `address` (String, optional)

**School Information:**
- `role` (String, required) - student, teaching_staff, non_teaching_staff
- `idNumber` (String, required) - Letters, numbers, and dash (-) only. Each role has its own ID numbering system.

**Student-Specific Fields:**
- `program` (String, optional) - CICT or CBME
- `course` (String, optional)
  - CICT: BSIT, BSCS, BSIS, BTVTED
  - CBME: BSA, BSAIS, BPA, BSE
- `yearLevel` (Int, optional) - 1, 2, 3, or 4
- `block` (Int, optional) - 1 to 5

**Teaching Staff-Specific Fields:**
- `department` (String, optional) - CICT or CBME

**Non-Teaching Staff-Specific Fields:**
- `staffCategory` (String, optional) - Administrative, Security, Maintenance, Support, or Clinic

### Removed Fields
- `name` (replaced with firstName, middleName, lastName, suffix)
- `age` (replaced with dateOfBirth)
- `email` (no longer used in patient records)

## API Changes (/api/patients/route.ts)

### Validation Rules Implemented

**Name Fields Validation:**
- Letters and spaces only (no numbers or special characters)
- Using regex: `/^[a-zA-Z\s]*$/`

**Phone Validation:**
- Must start with 09
- Exactly 11 digits total
- Numbers only
- Using regex: `/^09\d{9}$/`

**ID Number Validation:**
- Letters, numbers, and dash (-) only
- Using regex: `/^[a-zA-Z0-9-]+$/`

**Role-Specific Validation:**
- Students require: program, course, yearLevel, block
- Teaching staff require: department (program)
- Non-teaching staff require: staffCategory

### Response Format
- Successful creation returns 201 with created patient object
- Validation errors return 400 with array of error messages
- All old fields removed from API responses

## Frontend Changes (patients/page.tsx)

### New Type Definitions
```typescript
type PatientRole = "student" | "teaching_staff" | "non_teaching_staff"
type Program = "CICT" | "CBME"
type StudentCourse = "BSIT" | "BSCS" | "BSIS" | "BTVTED" | "BSA" | "BSAIS" | "BPA" | "BSE"
type NonTeachingCategory = "Administrative" | "Security" | "Maintenance" | "Support" | "Clinic"
```

### Form Structure
The form is now organized into two main sections:

#### Personal Information Section
- First Name (required) - Letters only
- Middle Name (optional) - Letters only
- Last Name (required) - Letters only
- Suffix (optional) - Letters only
- Gender (required) - Dropdown: Male/Female
- Date of Birth (required) - Date picker
- Contact Number (required) - Phone format validation
- Address (optional) - Free text

#### School Information Section
- Role/Classification (required) - Dropdown
- ID Number (required) - Custom format validation
- **Student-specific fields** (shown if role = "student"):
  - Program (required) - Dropdown: CICT, CBME
  - Course (required) - Dynamic dropdown based on selected program
  - Year Level (required) - Dropdown: 1st, 2nd, 3rd, 4th Year
  - Block (required) - Dropdown: 1-5
- **Teaching Staff fields** (shown if role = "teaching_staff"):
  - Program (required) - Dropdown: CICT, CBME
- **Non-Teaching Staff fields** (shown if role = "non_teaching_staff"):
  - Category (required) - Dropdown: Administrative, Security, Maintenance, Support, Clinic

### Sorting Options
- **Name (A-Z)** - Alphabetical by full name ascending
- **Name (Z-A)** - Alphabetical by full name descending
- **Role (A-Z)** - By role (student, teaching_staff, non_teaching_staff) ascending
- **Role (Z-A)** - By role descending
- **ID (Ascending)** - ID number in ascending order
- **ID (Descending)** - ID number in descending order

### Search
- Searches by full name and ID number
- Case-insensitive

### Patient Display Card
Shows relevant information based on role:
- Full name (firstName middleName lastName suffix)
- Role/Classification
- ID Number
- Date of Birth
- Gender
- Phone Number
- Address (if provided)
- **For Students**: Program, Course, Year Level, Block
- **For Teaching Staff**: Program
- **For Non-Teaching Staff**: Category

## Database Migration
A new migration has been created: `20251212102432_update_patient_schema`

To apply this migration:
```bash
npx prisma migrate dev
```

## Key Features

### Dynamic Form Fields
The form intelligently shows/hides fields based on selected role:
- When student is selected: Shows program, course, year level, block fields in a blue-highlighted section
- When teaching staff is selected: Shows program field in a green-highlighted section
- When non-teaching staff is selected: Shows category field in a yellow-highlighted section

### Course Selection
Courses dynamically update based on selected program:
- **CICT Program**: BSIT, BSCS, BSIS, BTVTED
- **CBME Program**: BSA, BSAIS, BPA, BSE

### Error Handling
Comprehensive validation with detailed error messages:
- Name field validation errors
- Phone format errors
- ID number format errors
- Role-specific field requirement errors

### Edit & Delete
- Edit button loads patient data into form for modification
- Delete button with confirmation dialog
- All changes persist to database with proper error handling

## Testing Checklist

- [x] Add student patient with all required fields
- [x] Add teaching staff patient with all required fields
- [x] Add non-teaching staff patient with all required fields
- [x] Validate name fields reject numbers/special characters
- [x] Validate phone format (09 + 9 digits)
- [x] Validate ID number format
- [x] Test sorting by name (A-Z, Z-A)
- [x] Test sorting by role
- [x] Test sorting by ID number (ascending, descending)
- [x] Test search functionality
- [x] Test edit functionality
- [x] Test delete functionality
- [x] Form validation error messages display correctly
- [x] Dynamic course selection based on program
- [x] Role-specific fields show/hide correctly

## Migration Notes
All existing patient records have been migrated using Prisma's migration system. The database schema is now fully compatible with the new patient system.
