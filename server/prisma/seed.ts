import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const postData: Prisma.postCreateInput[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "seed.json"), "utf8")
);

async function main() {
  console.log(`Start seeding ...`);
  await Promise.all(
    postData.map((data) => {
      return prisma.post.create({
        data,
      });
    })
  );
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
