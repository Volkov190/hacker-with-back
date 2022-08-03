import axios from "axios";
import fs from "fs";
import path from "path";

async function main() {
  const newest = await axios(
    "https://hacker-news.firebaseio.com/v0/newstories.json"
  ).then((res) => res.data);

  const requests = newest.map((id: number) =>
    axios(`https://api.hnpwa.com/v0/item/${id}.json`)
  );

  Promise.all(requests)
    .then((responses) =>
      responses.map((response) => changeComments(response.data))
    )
    .then((responses) => {
      fs.writeFile(
        path.resolve(__dirname, "seed.json"),
        JSON.stringify(responses),
        (err) => {
          err && console.log("Error", err);
        }
      );
    });
}

function changeComments(item: any) {
  const newItem = {
    user: item.user || null,
    time_ago: item.time_ago || "",
    content: item.content || "",
    comments_count: item.comments_count || 0,
    time: item.time || 0,
    title: item.title || "",
    url: item.url || null,
    points: item.points || null,
    type: item.type || null,
    comments: item.type || null,
  };
  if (newItem.comments) {
    let comments = item.comments;

    comments = comments.map((comment: any) => changeComments(comment));
    newItem.comments = {
      create: [...comments],
    };
  }
  return newItem;
}

main();
