import { PrismaClient } from "@prisma/client";

export async function GET(request) {
  try {
    const prisma = new PrismaClient();
    const searchParams = request.nextUrl.searchParams;
    const offsetId = searchParams.get("offsetId");
    const account = searchParams.get("account");

    if (!account)
      return Response.json({ message: "account provided" }, { status: 400 });

    let data;
    if (!offsetId) {
      // Get the waste record for the acccount
      data = await prisma.wasteRecords.findMany({
        take: 5,
        where: {
          account,
        },
        include: {
          wcp: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    if (offsetId) {
      console.log(offsetId);
      data = await prisma.wasteRecords.findMany({
        take: 5,
        where: {
          account,
          id: {
            lt: Number(offsetId),
          },
        },
        include: {
          wcp: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    await prisma.$disconnect();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(error.message, { status: 500 });
  }
}
