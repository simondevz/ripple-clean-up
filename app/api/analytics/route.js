import { PrismaClient } from "@prisma/client";

export async function GET(request) {
  try {
    const prisma = new PrismaClient();
    const millisecondsWeek = 7 * 24 * 60 * 60 * 1000;
    const aWeekAgo = Date.now() - millisecondsWeek;
    const time = new Date(aWeekAgo);

    const data = await prisma.wasteRecords.findMany({
      where: {
        createdAt: {
          gt: time,
        },
      },
    });

    let bags = 0;
    for (let index = 0; index < data.length; index++) {
      bags += data[index].number;
    }
    const amount = bags * Number(process.env.NEXT_PUBLIC_PAY_PER_BAG);

    await prisma.$disconnect();
    return Response.json({ data: { bags, amount } }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(error.message, { status: 500 });
  }
}
