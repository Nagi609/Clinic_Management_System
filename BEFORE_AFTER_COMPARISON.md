# Before & After Comparison

## Database Schema

### BEFORE
```
Patient {
  id: String @id
  name: String
  age: Int
  gender: String
  phone: String
  email: String
  address: String?
  attachments: String?
  userId: String
}
```

### AFTER
```
Patient {
  // Personal Information
  id: String @id
  firstName: String
  middleName: String?
  lastName: String
  suffix: String?
  dateOfBirth: String
  gender: String
  phone: String (format: 09xxxxxxxxx)
  address: String?
  
  // School Information
  role: String (student | teaching_staff | non_teaching_staff)
  idNumber: String (alphanumeric with dash)
  
  // Student-specific
  program: String? (CICT | CBME)
  course: String?
  yearLevel: Int?
  block: Int?
  
  // Teaching Staff-specific
  department: String? (CICT | CBME)
  
  // Non-Teaching Staff-specific
  staffCategory: String? (Administrative | Security | Maintenance | Support | Clinic)
  
  // Metadata
  attachments: String?
  userId: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Form Structure

### BEFORE
Simple form with 7 fields:
- Name (single field)
- Age
- Gender (dropdown)
- Phone
- Email
- Address
- Attachments

### AFTER
Organized form with 18+ fields in 2 sections:

**Personal Information Section:**
- First Name
- Middle Name (optional)
- Last Name
- Suffix (optional)
- Gender (dropdown)
- Date of Birth (date picker)
- Contact Number
- Address (optional)

**School Information Section:**
- Role/Classification (dropdown)
- ID Number
- [Conditional fields based on role]

**Conditional Sections:**
- **Students**: Program, Course, Year Level, Block (4 fields)
- **Teaching Staff**: Program (1 field)
- **Non-Teaching Staff**: Category (1 field)

## Validation

### BEFORE
- Name: Required, any text
- Age: Required, number only
- Phone: Number validation only
- Email: @ symbol required
- Basic error messages

### AFTER
- **Names**: Letters and spaces only (no numbers/special characters)
- **Phone**: Must start with 09 and be exactly 11 digits
- **ID Number**: Alphanumeric with dash only
- **Role-specific fields**: Required validation per role
- **Detailed error messages**: Specific guidance for each validation error
- **Client and server-side**: Dual validation for security

## Sorting Options

### BEFORE
- Name (A-Z)
- Name (Z-A)
- No role or ID sorting

### AFTER
- Name (A-Z)
- Name (Z-A)
- Role (A-Z)
- Role (Z-A)
- ID (Ascending)
- ID (Descending)

## Search

### BEFORE
- Search by name or email

### AFTER
- Search by full name (combines first, middle, last, suffix)
- Search by ID number
- More flexible matching

## Patient Display

### BEFORE
```
Patient Name
Age - Gender
Phone: 09123456789
Email: patient@example.com
Address: [if provided]
```

### AFTER
```
Full Name (First Middle Last Suffix)
Role: [Student/Teaching Staff/Non-Teaching Staff]
ID: [ID Number]
DOB: [Date of Birth]
Gender: [Male/Female]
Phone: [Contact Number]
Address: [if provided]

[Role-Specific Information]
- If Student: Program, Course, Year, Block
- If Teaching Staff: Program
- If Non-Teaching Staff: Category
```

## Data Model Differences

### Age vs. Date of Birth
- **Before**: Stored age (static number, becomes outdated)
- **After**: Stores date of birth (always current, can calculate age)

### Name Handling
- **Before**: Single field, any format allowed
- **After**: Separated into firstName, middleName, lastName, suffix for better data organization and searching

### Patient Classification
- **Before**: No classification system, all patients treated the same
- **After**: Three roles with specific requirements and data fields

### ID Number
- **Before**: No ID field
- **After**: Customizable ID field supporting alphanumeric format with dashes, allowing each role to have its own ID numbering system

## User Interface

### Before
- Single, simple form
- Basic input fields
- Gender filter on list
- Simple patient cards

### After
- Two-section form with clear visual hierarchy
- Color-coded sections for different role types
- Dynamic form that shows/hides fields based on selection
- Dynamic course selection based on program
- 6 sorting options
- Improved patient card display
- Better error handling and user feedback
- More professional, clinic-appropriate design

## API Response Format

### BEFORE
```json
{
  "patient": {
    "id": "abc123",
    "name": "John Smith",
    "age": 25,
    "gender": "Male",
    "phone": "09123456789",
    "email": "john@example.com",
    "address": "123 Main St"
  }
}
```

### AFTER
```json
{
  "patient": {
    "id": "abc123",
    "firstName": "John",
    "middleName": "David",
    "lastName": "Smith",
    "suffix": null,
    "dateOfBirth": "1999-06-15",
    "gender": "Male",
    "phone": "09123456789",
    "address": "123 Main St",
    "role": "student",
    "idNumber": "STU-2024-001",
    "program": "CICT",
    "course": "BSIT",
    "yearLevel": 2,
    "block": 3,
    "department": null,
    "staffCategory": null,
    "attachments": null,
    "userId": "user456",
    "createdAt": "2024-12-12T10:30:00Z",
    "updatedAt": "2024-12-12T10:30:00Z"
  }
}
```

## Error Handling

### BEFORE
Generic messages:
- "Name is required"
- "Phone must be numbers only"
- "Email must contain @"

### AFTER
Specific, helpful messages:
- "First name is required and must contain only letters"
- "Phone must start with 09 and be exactly 11 digits"
- "ID number is required and can only contain letters, numbers, and dashes"
- "Valid program (CICT or CBME) is required for students"
- "Course is required for students"
- And 10+ more specific validation messages

## Browser Experience

### BEFORE
- Basic form with standard inputs
- Gender filter dropdown
- Simple sorting
- Basic styling

### AFTER
- Modern, organized form layout
- Responsive design
- Conditional field visibility
- Dynamic dropdown options
- Color-coded sections by role
- Hover effects and transitions
- Better spacing and typography
- Professional clinic appearance
- Loading states
- Detailed success/error feedback

## Data Integrity

### BEFORE
- Can add patients with any data
- No structured relationship to roles
- Email required but not always used
- Age can become stale

### AFTER
- Strict validation ensures data quality
- Role determines required fields
- No email field (clinic-focused)
- Date of birth is reliable and current
- ID numbers support each role's system
- All data is properly typed and validated

## Scalability

### BEFORE
- Simple structure works for small clinics
- Limited filtering/organization options
- All patients treated identically

### AFTER
- Structured to support 3 distinct patient types
- Role-based organization and querying
- ID number system allows role-based numbering
- Sorting options enable quick staff location
- Ready for future expansions (programs, courses, departments)
