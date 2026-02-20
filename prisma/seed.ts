import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await hash("asdf1234", 12);

  // Create users
  const rahul = await prisma.user.upsert({
    where: { email: "rahul@team.com" },
    update: {},
    create: {
      name: "Rahul.A",
      email: "rahul@team.com",
      password: defaultPassword,
      role: "admin",
      mustResetPassword: true,
    },
  });

  const aeishwarya = await prisma.user.upsert({
    where: { email: "aeishwarya@team.com" },
    update: {},
    create: {
      name: "Aeishwarya.D",
      email: "aeishwarya@team.com",
      password: defaultPassword,
      role: "user",
      mustResetPassword: true,
    },
  });

  const james = await prisma.user.upsert({
    where: { email: "james@team.com" },
    update: {},
    create: {
      name: "James.K",
      email: "james@team.com",
      password: defaultPassword,
      role: "user",
      mustResetPassword: true,
    },
  });

  const priya = await prisma.user.upsert({
    where: { email: "priya@team.com" },
    update: {},
    create: {
      name: "Priya.M",
      email: "priya@team.com",
      password: defaultPassword,
      role: "user",
      mustResetPassword: true,
    },
  });

  const sam = await prisma.user.upsert({
    where: { email: "sam@team.com" },
    update: {},
    create: {
      name: "Sam.T",
      email: "sam@team.com",
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
      presenterId: james.id,
      createdAt: new Date("2026-02-13"),
    },
  });

  const topic4 = await prisma.topic.create({
    data: {
      title: "Figma vs. Code: Bridging the Handoff Gap",
      description:
        "Discussing practical strategies to reduce friction between design and engineering during handoff, including design tokens and shared component libraries.",
      presenterId: priya.id,
      createdAt: new Date("2026-02-15"),
    },
  });

  // Create votes
  const voteData = [
    // Topic 1 - 23 total votes
    { userId: rahul.id, topicId: topic1.id, count: 5 },
    { userId: aeishwarya.id, topicId: topic1.id, count: 5 },
    { userId: james.id, topicId: topic1.id, count: 5 },
    { userId: priya.id, topicId: topic1.id, count: 4 },
    { userId: sam.id, topicId: topic1.id, count: 4 },
    // Topic 2 - 18 total votes
    { userId: rahul.id, topicId: topic2.id, count: 5 },
    { userId: aeishwarya.id, topicId: topic2.id, count: 4 },
    { userId: james.id, topicId: topic2.id, count: 3 },
    { userId: priya.id, topicId: topic2.id, count: 3 },
    { userId: sam.id, topicId: topic2.id, count: 3 },
    // Topic 3 - 14 total votes
    { userId: rahul.id, topicId: topic3.id, count: 4 },
    { userId: aeishwarya.id, topicId: topic3.id, count: 3 },
    { userId: james.id, topicId: topic3.id, count: 3 },
    { userId: priya.id, topicId: topic3.id, count: 2 },
    { userId: sam.id, topicId: topic3.id, count: 2 },
    // Topic 4 - 9 total votes
    { userId: rahul.id, topicId: topic4.id, count: 2 },
    { userId: aeishwarya.id, topicId: topic4.id, count: 2 },
    { userId: james.id, topicId: topic4.id, count: 2 },
    { userId: priya.id, topicId: topic4.id, count: 2 },
    { userId: sam.id, topicId: topic4.id, count: 1 },
  ];

  for (const v of voteData) {
    await prisma.vote.create({ data: v });
  }

  console.log("Seed data created successfully!");
  console.log("Users created: rahul@team.com (admin), aeishwarya@team.com, james@team.com, priya@team.com, sam@team.com");
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
