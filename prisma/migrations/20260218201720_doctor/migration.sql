-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "doctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNUmber" TEXT,
    "address" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "registrationNumber" TEXT NOT NULL,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "gender" "Gender" NOT NULL,
    "appointmentFee" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "qualification" TEXT NOT NULL,
    "currentWorkingPlace" TEXT NOT NULL,
    "designayion" TEXT NOT NULL,
    "avarageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "doctor_specialities" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specilityId" TEXT NOT NULL,

    CONSTRAINT "doctor_specialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_id_key" ON "doctor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_email_key" ON "doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_registrationNumber_key" ON "doctor"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_userId_key" ON "doctor"("userId");

-- CreateIndex
CREATE INDEX "idx_doctor_email" ON "doctor"("email");

-- CreateIndex
CREATE INDEX "idx_doctor_isDeleted" ON "doctor"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_doctorId" ON "doctor_specialities"("doctorId");

-- CreateIndex
CREATE INDEX "idx_doctor_speciality_specialityId" ON "doctor_specialities"("specilityId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_specialities_doctorId_specilityId_key" ON "doctor_specialities"("doctorId", "specilityId");

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialities" ADD CONSTRAINT "doctor_specialities_specilityId_fkey" FOREIGN KEY ("specilityId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
