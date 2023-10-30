import { PrismaClient } from "@prisma/client";

export async function POST(request) {
  try {
    const prisma = new PrismaClient();
    const { account, name, address, phone, email } = await request.json();

    const data = await prisma.wasteCollectionPoints.create({
      data: {
        account,
        name,
        address,
        phone,
        email,
      },
    });
    await prisma.$disconnect();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(error.message, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const prisma = new PrismaClient();
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const account = searchParams.get("account");

    if (!query && !account)
      return Response.json(
        { message: "No query or account provided" },
        { status: 400 }
      );

    let data;
    if (query === "all") {
      // Optimise this for when the table gets large
      data = await prisma.wasteCollectionPoints.findMany({
        take: 50,
        orderBy: {
          name: "asc",
        },
      });
    }

    if (account) {
      // Get the wcp profile data for the acccount
      data = await prisma.wasteCollectionPoints.findUnique({
        where: {
          account,
        },
      });
    }

    await prisma.$disconnect();
    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(error.message, { status: 500 });
  }
}
