import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// async function main() {
//   const term = await prisma.term.findMany({
//     where: { name: 'test' },
//   });
//   console.log(term);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
