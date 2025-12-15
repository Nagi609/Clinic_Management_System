# Patient Management System - Quick Reference Guide

## System Overview
The clinic patient management system now classifies all school community members into three categories:
- **Students** - With academic program and course information
- **Teaching Staff** - With program affiliation
- **Non-Teaching Staff** - With department category

## Adding a New Patient

### Step 1: Click "Add Patient" Button
- Located in the top-right corner of the Patients page

### Step 2: Fill Personal Information
1. **First Name** (required) - Only letters allowed
2. **Middle Name** (optional) - Only letters allowed
3. **Last Name** (required) - Only letters allowed
4. **Suffix** (optional) - e.g., Jr., Sr. (Letters only)
5. **Gender** (required) - Select Male or Female
6. **Date of Birth** (required) - Use the date picker
7. **Contact Number** (required) - Must be in format: 09xxxxxxxxx (starts with 09, exactly 11 digits)
8. **Address** (optional) - Any address information

### Step 3: Fill School Information
1. **Role/Classification** (required) - Select one:
   - Student
   - Teaching Staff
   - Non-Teaching Staff

2. **ID Number** (required) - Can contain:
   - Letters (A-Z, a-z)
   - Numbers (0-9)
   - Dashes (-)
   - NOTE: Each role has its own ID numbering system

3. **Role-Specific Information** (varies by role selected):

#### If Student Selected:
- **Program** (required) - Choose CICT or CBME
- **Course** (required) - Will populate based on program:
  - If CICT: BSIT, BSCS, BSIS, BTVTED
  - If CBME: BSA, BSAIS, BPA, BSE
- **Year Level** (required) - Choose 1st, 2nd, 3rd, or 4th Year
- **Block** (required) - Choose from 1 to 5

#### If Teaching Staff Selected:
- **Program** (required) - Choose CICT or CBME

#### If Non-Teaching Staff Selected:
- **Category** (required) - Choose one:
  - Administrative
  - Security
  - Maintenance
  - Support
  - Clinic

### Step 4: Submit
- Click "Add Patient" button to save
- If there are errors, they will be displayed in red at the top of the form
- Upon successful submission, the form will close and patient will appear in the list

## Viewing Patient List

### Searching
- Use the search box at the top to search by:
  - Full name (first, middle, last, suffix)
  - ID number
- Search is case-insensitive

### Sorting
Click the "Sort By" dropdown to arrange patients:
- **Name (A-Z)** - Alphabetical by full name
- **Name (Z-A)** - Reverse alphabetical by full name
- **Role (A-Z)** - By role classification
- **Role (Z-A)** - By role classification (reverse)
- **ID (Ascending)** - ID numbers from lowest to highest
- **ID (Descending)** - ID numbers from highest to lowest

### Patient Card Display
Each patient card shows:
- **Full Name** - First, Middle, Last, Suffix (if any)
- **Role** - Student/Teaching Staff/Non-Teaching Staff
- **ID** - Their unique ID number
- **DOB** - Date of Birth in local format
- **Gender** - Male or Female
- **Phone** - Contact number
- **Address** - If provided
- **Role-Specific Details**:
  - Students: Program, Course, Year Level, Block
  - Teaching Staff: Program
  - Non-Teaching Staff: Category

## Editing a Patient

1. Click the "Edit" button on the patient's card
2. The form will populate with the patient's current information
3. Modify any fields as needed
4. Click "Update Patient" to save changes
5. Or click "Cancel" to discard changes

## Deleting a Patient

1. Click the "Delete" button on the patient's card
2. Confirm the deletion when prompted
3. Patient will be removed from the system immediately

## Validation Rules

### Names (First, Middle, Last, Suffix)
- ✓ Only letters (A-Z, a-z) and spaces allowed
- ✗ No numbers, special characters, or symbols

### Contact Number
- ✓ Must start with 09
- ✓ Must be exactly 11 digits
- ✓ Numbers only
- Example: 09123456789

### ID Number
- ✓ Letters (A-Z, a-z)
- ✓ Numbers (0-9)
- ✓ Dashes (-)
- ✗ No spaces or special characters
- Examples: STU-2024-001, TS-CICT-01, NTS-ADMIN-5

## Error Messages Guide

| Error Message | Solution |
|---|---|
| "First/Last name is required" | Ensure both first and last names are filled in |
| "Name can only contain letters" | Remove any numbers or special characters from name fields |
| "Phone must start with 09 and be exactly 11 digits" | Format: 09 + 9 more digits (09123456789) |
| "ID number can only contain letters, numbers, and dashes" | Remove spaces and special characters from ID |
| "Program is required for students" | Select CICT or CBME for student patients |
| "Course is required for students" | Select a course from the dropdown |
| "Year level is required for students" | Select a year level (1st-4th) |
| "Block is required for students" | Select a block (1-5) |
| "Program is required for teaching staff" | Select CICT or CBME |
| "Category is required for non-teaching staff" | Select a category (Admin, Security, etc.) |

## Tips & Best Practices

1. **ID Numbers**: Establish a consistent naming convention for each role:
   - Students: STU-YEAR-SEQ (STU-2024-001)
   - Teaching Staff: TS-DEPT-ID (TS-CICT-01)
   - Non-Teaching Staff: NTS-CAT-ID (NTS-SEC-01)

2. **Search**: Use patient names or ID numbers for quick lookup
   - Partial names work (e.g., "John" finds "John Smith")
   - Partial IDs work (e.g., "STU" finds all students)

3. **Sorting**: Combine sorting and searching for efficient data management
   - Sort by role, then search within that role
   - Sort by ID to find students in the same block/course

4. **Data Entry**: Be consistent with dates and formatting
   - Use the date picker for birthdate to ensure correct format
   - Follow your established ID numbering convention

## Database Notes
- All patient data is encrypted and stored securely
- Changes are saved immediately upon clicking the action button
- Deletion is permanent - use caution
- Patient records are linked to visit records and cannot be deleted if active visits exist
