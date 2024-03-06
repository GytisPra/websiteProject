import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateRandomSecretCode = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

async function seed() {
  const email = "test@gmail.com";
  const currentDate = new Date();
  const secretCode = generateRandomSecretCode(10);
  console.log(secretCode);

  await prisma.secretCodeAdmin.create({
    data: {
      customName: "test",
      email: email,
      contractNumber: "test",
      ExpirationDate: currentDate,
      Used: false,
      role: "admin",
      secretCode: secretCode
    }
  });
  // const user = await prisma.user.create({
  //   data: {
  //     email,
  //     password: {
  //       create: {
  //         hash: hashedPassword,
  //       },
  //     },
  //   },
  // });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
