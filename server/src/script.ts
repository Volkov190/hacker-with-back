import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

const prisma = new PrismaClient();
const app = express();
const timeAgo = new TimeAgo("en-US");

app.use(cors());

async function countComments(id: number) {
  let count = 0;

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      comments: true,
    },
  });

  if (comment === null) return count;

  count += comment.comments.length;

  await Promise.all(
    comment.comments.map(async (comment: { id: number }) => {
      return await countComments(comment.id);
    })
  ).then((res) => {
    res.forEach((el: number) => {
      count += el;
    });
  });

  return count;
}

app.get("/item/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.json(null);
    return;
  }

  let comments_count = 0;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { comments: true },
  });

  if (post !== null) {
    comments_count = post.comments.length;

    await Promise.all(
      post.comments.map(async (comment: { id: number }) => {
        return await countComments(comment.id);
      })
    ).then((res) => {
      res.forEach((count: number) => {
        comments_count += count;
      });
    });

    res.json({ ...post, comments_count });
  } else {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { comments: true },
    });

    if (comment === null) res.json(null);
    else {
      comments_count = await countComments(comment.id);
      res.json({
        ...comment,
        comments_count,
        time_ago: timeAgo.format(new Date(comment.time * 1000)),
      });
    }
  }
});

app.get("/newest/:pageNum", async (req, res) => {
  const page = parseInt(req.params.pageNum);
  const newsInPage = 30;
  const posts = await prisma.post.findMany({
    orderBy: { time: "desc" },
    skip: (page - 1) * newsInPage,
    take: newsInPage,
  });
  res.json(posts);
});

const server = app.listen(8080);
