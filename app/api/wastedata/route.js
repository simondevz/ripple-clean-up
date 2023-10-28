import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: "YipO5_uZZSLqTUvSA6",
});

export async function POST(request) {
  try {
    const { images, number, wcpId, account } = await request.json();
    // Validate data
    if (!(images.length > 0) || !(Number(number) > 0) || !wcpId || !account)
      return Response.json({ message: "invalid data", status: 400 });

    // Upload the imagge and get the needed data
    for (let index = 0; index < images.length; index++) {
      const result = await cloudinary.uploader.unsigned_upload(
        images[index],
        "ripple_clen_up"
      );
      images[index] = result;
    }

    // Update the database of the wastes
    const prisma = new PrismaClient();
    const data = await prisma.wasteRecords.create({
      data: {
        account,
        number,
        verified: false,
        wcpId,
      },
    });

    // update the database of the images next
    for (let index = 0; index < images.length; index++) {
      await prisma.image.create({
        data: {
          url: images[index].url,
          wasteRecordId: data.id,
        },
      });
    }

    await prisma.$disconnect();
    return Response.json({ message: "success", data }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({
      message: error?.message || "server error",
      status: 500,
    });
  }
}

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    // Validate data
    const wcpId = Number(id);
    if (!(wcpId > 0))
      return Response.json({ message: "invalid data", status: 400 });

    // get data from the database of the wastes
    const prisma = new PrismaClient();
    const data = await prisma.wasteRecords.findMany({
      take: 100,
      where: {
        wcpId,
      },
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    await prisma.$disconnect();
    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({
      message: error?.message || "server error",
      status: 500,
    });
  }
}

export async function PUT(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    // Validate data
    const submitionId = Number(id);
    if (!(submitionId > 0))
      return Response.json({ message: "invalid data", status: 400 });

    // update data in the database of the wastes
    const prisma = new PrismaClient();
    const data = await prisma.wasteRecords.update({
      where: {
        id: submitionId,
      },
      include: {
        images: true,
      },
      data: {
        verified: true,
      },
    });

    await prisma.$disconnect();
    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({
      message: error?.message || "server error",
      status: 500,
    });
  }
}
