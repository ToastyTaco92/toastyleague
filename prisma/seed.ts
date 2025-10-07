import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const season = await prisma.season.upsert({
    where: { id: "seed-season" },
    update: {},
    create: {
      id: "seed-season",
      name: "Season 1 (Pilot)",
      startDate: new Date(Date.now() + 7*24*60*60*1000),
      endDate: new Date(Date.now() + 8*7*24*60*60*1000),
      leagues: {
        create: {
          title: "FPS Pilot League",
          game: "Valorant",
          divisions: {
            create: [{ name: "Silver", platform: "PC", slots: 32 }],
          },
        },
      },
    },
  });
  console.log("Seeded:", season.name);
}
main().finally(()=>prisma.$disconnect());
