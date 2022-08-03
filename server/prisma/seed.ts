import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const itemData: Prisma.ItemCreateInput[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "seed.json"), "utf8")
);

async function main() {
  console.log(`Start seeding ...`);
  for (const it of itemData) {
    const item = await prisma.item.create({
      data: it,
    });
    console.log(`Created user with id: ${item.id}`);
  }
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
