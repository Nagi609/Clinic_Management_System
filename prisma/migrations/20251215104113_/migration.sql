-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VisitRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT,
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
INSERT INTO "new_VisitRecord" ("createdAt", "id", "notes", "patientId", "reason", "symptoms", "treatment", "updatedAt", "userId", "visitDate") SELECT "createdAt", "id", "notes", "patientId", "reason", "symptoms", "treatment", "updatedAt", "userId", "visitDate" FROM "VisitRecord";
DROP TABLE "VisitRecord";
ALTER TABLE "new_VisitRecord" RENAME TO "VisitRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
