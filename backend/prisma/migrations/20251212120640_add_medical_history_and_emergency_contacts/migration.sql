-- AlterTable
ALTER TABLE "Patient" ADD COLUMN "allergies" TEXT;
ALTER TABLE "Patient" ADD COLUMN "currentMedication" TEXT;
ALTER TABLE "Patient" ADD COLUMN "medicalNotes" TEXT;
ALTER TABLE "Patient" ADD COLUMN "pastIllnesses" TEXT;
ALTER TABLE "Patient" ADD COLUMN "primaryContactAddress" TEXT;
ALTER TABLE "Patient" ADD COLUMN "primaryContactName" TEXT;
ALTER TABLE "Patient" ADD COLUMN "primaryContactPhone" TEXT;
ALTER TABLE "Patient" ADD COLUMN "primaryContactRelationship" TEXT;
ALTER TABLE "Patient" ADD COLUMN "secondaryContactAddress" TEXT;
ALTER TABLE "Patient" ADD COLUMN "secondaryContactName" TEXT;
ALTER TABLE "Patient" ADD COLUMN "secondaryContactPhone" TEXT;
ALTER TABLE "Patient" ADD COLUMN "secondaryContactRelationship" TEXT;
ALTER TABLE "Patient" ADD COLUMN "surgeries" TEXT;
