const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const seedQuestions = [
  {
    Qid: 1,
    title: "Javascript",
    date: new Date("2026-03-20"),
    content: "What’s the difference between == and === in JavaScript?",
    keywords: ["js", "==", "http"]
  },
  {
    Qid: 2,
    title: "Performance of a React",
    date: new Date("2026-03-22"),
    content: "How do you improve the performance of a React or Next.js app?",
    keywords: ["react", "next.js"]
  },
  {
    Qid: 3,
    title: "Prosess of the browser rendering",
    date: new Date("2026-03-25"),
    content: "Can you explain how the browser rendering process works?",
    keywords: ["browser", "rendering"]
  },
  {
    Qid: 4,
    title: "Accessible of sites",
    date: new Date("2026-03-26"),
    content: "How do you make sure a site is accessible?",
    keywords: ["sites", "accessible"]
  }
];

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("Created user:", user.email);

  for (const question of seedQuestions) {
    await prisma.question.create({
      data: {
        title: question.title,
        date: question.date,
        content: question.content,
        userId: user.id,
        keywords: {
          connectOrCreate: question.keywords.map((kw) => ({
            where: { name: kw },
            create: { name: kw },
          })),
        },
      },
    });
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

