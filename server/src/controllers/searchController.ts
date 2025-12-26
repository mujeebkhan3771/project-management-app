// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const search = async (req: Request, res: Response): Promise<void> => {
//   const { query } = req.query;
//   try {
//     const tasks = await prisma.task.findMany({
//       where: {
//         OR:[
//           { title : {contains: query as string}},
//           { description : {contains: query as string}},
//         ],
//       },
//     });
//     const projects = await prisma.project.findMany({
//       where: {
//         OR:[
//           { name : {contains: query as string}},
//           { description : {contains: query as string}},
//         ],
//       },
//     });
//     const users = await prisma.user.findMany({
//       where: {
//         OR:[
//           { username : {contains: query as string}},
//         ],
//       },
//     });
//     res.json({tasks, projects , users});
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: `Error performing Search : ${error.message}` });
//   }
// };



// done case insensitive search 

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const search = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.query as string;

  try {
    if (!query) {
      res.json({ tasks: [], projects: [], users: [] });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    res.json({ tasks, projects, users });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error performing Search : ${error.message}` });
  }
};
