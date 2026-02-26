import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🧹 Resetting database...");

  // IMPORTANT: Table names must match exactly PostgreSQL table names
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Comment",
      "Attachment",
      "TaskAssignment",
      "Task",
      "ProjectTeam",
      "Project",
      "User",
      "Team"
    RESTART IDENTITY CASCADE;
  `);

  console.log("✅ Database reset complete.");
}

async function seedData() {
  const dataDirectory = path.join(__dirname, "seedData");

  // Correct relational order
  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "taskAssignment.json",
    "attachment.json",
    "comment.json",
  ];

  console.log("🌱 Seeding new data...");

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${fileName}`);
      continue;
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));

    try {
      // Use createMany for performance
      await (prisma as any)[modelName].createMany({
        data: jsonData,
      });

      console.log(`✅ Seeded ${modelName}`);
    } catch (error) {
      console.error(`❌ Error seeding ${modelName}:`, error);
    }
  }

  console.log("🎉 Seeding completed successfully!");
}

async function main() {
  await resetDatabase();
  await seedData();
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
