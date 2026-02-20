import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await hash("asdf1234", 12);

  // Clear existing data (order matters for FK constraints)
  await prisma.vote.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const rahul = await prisma.user.create({
    data: {
      name: "Rahul.A",
      email: "rahul.hareendran@dbizsolution.com",
      password: defaultPassword,
      role: "admin",
      mustResetPassword: true,
    },
  });

  const aeishwarya = await prisma.user.create({
    data: {
      name: "Aeishwarya.D",
      email: "aeishwarya.lokhande@dbizsolution.com",
      password: defaultPassword,
      role: "user",
      mustResetPassword: true,
    },
  });

  const jaffar = await prisma.user.create({
    data: {
      name: "Jaffar.M",
      email: "jaffar.moideen@dbizsolution.com",
      password: defaultPassword,
      role: "user",
      mustResetPassword: true,
    },
  });

  const adanna = await prisma.user.create({
    data: {
      name: "Adanna.W",
      email: "adanna.w@dbizsolution.com",
      password: defaultPassword,
      role: "user",
      mustResetPassword: true,
    },
  });

  const kavya = await prisma.user.create({
    data: {
      name: "Kavya.J",
      email: "kavya.joseph@dbizsolution.com",
      password: defaultPassword,
      role: "user",
      mustResetPassword: true,
    },
  });

  // Create topics
  const topic1 = await prisma.topic.create({
    data: {
      title: "Practical Accessibility Patterns in Fintech",
      description:
        "Exploring real-world accessibility patterns used in financial technology products, including screen reader optimization, keyboard navigation, and WCAG AA compliance strategies.",
      presenterId: aeishwarya.id,
      createdAt: new Date("2026-02-14"),
    },
  });

  const topic2 = await prisma.topic.create({
    data: {
      title: "Micro-Interactions That Drive Retention",
      description:
        "Deep dive into subtle animation patterns and haptic feedback loops that keep users engaged without being intrusive or battery-draining.",
      presenterId: rahul.id,
      createdAt: new Date("2026-02-12"),
    },
  });

  const topic3 = await prisma.topic.create({
    data: {
      title: "Design Tokens at Scale: Multi-Brand Systems",
      description:
        "How to architect a design token system that supports multiple brands, themes, and platforms without collapsing under complexity.",
      presenterId: jaffar.id,
      createdAt: new Date("2026-02-13"),
    },
  });

  const topic4 = await prisma.topic.create({
    data: {
      title: "Figma vs. Code: Bridging the Handoff Gap",
      description:
        "Discussing practical strategies to reduce friction between design and engineering during handoff, including design tokens and shared component libraries.",
      presenterId: adanna.id,
      createdAt: new Date("2026-02-15"),
    },
  });

  // Create votes
  const voteData = [
    // Topic 1 - 23 total votes
    { userId: rahul.id, topicId: topic1.id, count: 5 },
    { userId: aeishwarya.id, topicId: topic1.id, count: 5 },
    { userId: jaffar.id, topicId: topic1.id, count: 5 },
    { userId: adanna.id, topicId: topic1.id, count: 4 },
    { userId: kavya.id, topicId: topic1.id, count: 4 },
    // Topic 2 - 18 total votes
    { userId: rahul.id, topicId: topic2.id, count: 5 },
    { userId: aeishwarya.id, topicId: topic2.id, count: 4 },
    { userId: jaffar.id, topicId: topic2.id, count: 3 },
    { userId: adanna.id, topicId: topic2.id, count: 3 },
    { userId: kavya.id, topicId: topic2.id, count: 3 },
    // Topic 3 - 14 total votes
    { userId: rahul.id, topicId: topic3.id, count: 4 },
    { userId: aeishwarya.id, topicId: topic3.id, count: 3 },
    { userId: jaffar.id, topicId: topic3.id, count: 3 },
    { userId: adanna.id, topicId: topic3.id, count: 2 },
    { userId: kavya.id, topicId: topic3.id, count: 2 },
    // Topic 4 - 9 total votes
    { userId: rahul.id, topicId: topic4.id, count: 2 },
    { userId: aeishwarya.id, topicId: topic4.id, count: 2 },
    { userId: jaffar.id, topicId: topic4.id, count: 2 },
    { userId: adanna.id, topicId: topic4.id, count: 2 },
    { userId: kavya.id, topicId: topic4.id, count: 1 },
  ];

  for (const v of voteData) {
    await prisma.vote.create({ data: v });
  }

  console.log("Seed data created successfully!");
  console.log("Users created: rahul.hareendran@dbizsolution.com (admin), aeishwarya.lokhande@dbizsolution.com, jaffar.moideen@dbizsolution.com, adanna.w@dbizsolution.com, kavya.joseph@dbizsolution.com");
  console.log("Default password: asdf1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
