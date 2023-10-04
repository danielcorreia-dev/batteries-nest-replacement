-- CreateTable
CREATE TABLE "user_retrived_benefits" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "benefit_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_retrived_benefits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_retrived_benefits" ADD CONSTRAINT "user_retrived_benefits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_retrived_benefits" ADD CONSTRAINT "user_retrived_benefits_benefit_id_fkey" FOREIGN KEY ("benefit_id") REFERENCES "benefits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
