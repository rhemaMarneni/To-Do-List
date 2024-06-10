import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "your-db-name",
  password: "your-db-password",
  port: "5432"
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Task 1" },
  { id: 2, title: "Task 2" },
];

async function getAllItems(){
  const result = await db.query("SELECT * FROM items;");
  let items = []
  result.rows.forEach((item)=>{
    items.push(item);
  })
  return items;
}

app.get("/", async (req, res) => {
  const items = await getAllItems();
  res.render("index.ejs", {
    listTitle: "To Do List",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("INSERT INTO items (title) VALUES ($1)",[item]); 
    // items.push({ title: item });
    res.redirect("/");
  }
  catch(err){ 
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const updatedTitle = req.body.updatedItemTitle;
  const updatedId = req.body.updatedItemId;
  try{
    await db.query("UPDATE items SET title = $1 WHERE id = $2",[updatedTitle,updatedId]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const itemid = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id = $1",[itemid]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
