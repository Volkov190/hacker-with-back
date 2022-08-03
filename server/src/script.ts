import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(cors());

app.get("/item/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await prisma.item.findUnique({
    where: { id },
    include: { comments: true },
  });
  res.json(post);
});

app.get("/newest/:pageNum", async (req, res) => {
  const page = parseInt(req.params.pageNum);
  const newsInPage = 30;
  const posts = await prisma.item.findMany({
    where: { type: "link" },
    orderBy: { time: "desc" },
    skip: (page - 1) * newsInPage,
    take: newsInPage,
  });
  res.json(posts);
});

const server = app.listen(8080);
