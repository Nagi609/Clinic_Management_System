-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numericId" INTEGER NOT NULL DEFAULT 0,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "suffix" TEXT,
    "dateOfBirth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "role" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "program" TEXT,
    "course" TEXT,
    "yearLevel" INTEGER,
    "block" INTEGER,
    "department" TEXT,
    "staffCategory" TEXT,
    "pastIllnesses" TEXT,
    "surgeries" TEXT,
    "currentMedication" TEXT,
    "allergies" TEXT,
    "medicalNotes" TEXT,
    "primaryContactName" TEXT,
    "primaryContactRelationship" TEXT,
    "primaryContactPhone" TEXT,
    "primaryContactAddress" TEXT,
    "secondaryContactName" TEXT,
    "secondaryContactRelationship" TEXT,
    "secondaryContactPhone" TEXT,
    "secondaryContactAddress" TEXT,
    "attachments" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Patient" ("address", "allergies", "attachments", "block", "course", "createdAt", "currentMedication", "dateOfBirth", "department", "email", "firstName", "gender", "id", "idNumber", "lastName", "medicalNotes", "middleName", "pastIllnesses", "phone", "primaryContactAddress", "primaryContactName", "primaryContactPhone", "primaryContactRelationship", "program", "role", "secondaryContactAddress", "secondaryContactName", "secondaryContactPhone", "secondaryContactRelationship", "staffCategory", "suffix", "surgeries", "updatedAt", "userId", "yearLevel") SELECT "address", "allergies", "attachments", "block", "course", "createdAt", "currentMedication", "dateOfBirth", "department", "email", "firstName", "gender", "id", "idNumber", "lastName", "medicalNotes", "middleName", "pastIllnesses", "phone", "primaryContactAddress", "primaryContactName", "primaryContactPhone", "primaryContactRelationship", "program", "role", "secondaryContactAddress", "secondaryContactName", "secondaryContactPhone", "secondaryContactRelationship", "staffCategory", "suffix", "surgeries", "updatedAt", "userId", "yearLevel" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_numericId_key" ON "Patient"("numericId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
