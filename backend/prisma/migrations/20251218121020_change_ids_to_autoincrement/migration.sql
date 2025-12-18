/*
  Warnings:

  - The primary key for the `Patient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `VisitRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `VisitRecord` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `patientId` on the `VisitRecord` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
CREATE TABLE "new_VisitRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER,
    "visitorName" TEXT,
    "userId" TEXT NOT NULL,
    "visitDate" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VisitRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VisitRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_VisitRecord" ("createdAt", "id", "notes", "patientId", "reason", "symptoms", "treatment", "updatedAt", "userId", "visitDate", "visitorName") SELECT "createdAt", "id", "notes", "patientId", "reason", "symptoms", "treatment", "updatedAt", "userId", "visitDate", "visitorName" FROM "VisitRecord";
DROP TABLE "VisitRecord";
ALTER TABLE "new_VisitRecord" RENAME TO "VisitRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
