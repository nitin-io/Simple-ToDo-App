const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config()
const app = express();

app.use(express.static(__dirname + "/public/"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0.vbmnmrs.mongodb.net/todoItemsDB?retryWrites=true&w=majority`);

const itemSchema = {
  todo: String,
};

const listSchema = {
  listName: String,
  items: [itemSchema],
};

const Item = mongoose.model("Item", itemSchema);

const List = mongoose.model("List", listSchema);

const item1 = new Item({
  todo: "Welcome to your to do list",
});

const item2 = new Item({
  todo: "You can start adding your to dos by clicking + button",
});

const item3 = new Item({
  todo: "<-- You can delete todo by clicking this.",
});

const today = new Date();
console.log(today);

const options = {
  weekday: "long",
  day: "2-digit",
  month: "short",
  year: "numeric",
};

let day = today.toLocaleDateString("en-US", options);

app.get("/", (req, res) => {
  Item.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    } else if (docs.length === 0) {
      Item.insertMany([item1, item2, item3]);
      res.redirect("/");
    } else {
      res.render("index", { listTitle: day, newTodoItems: docs });
    }
  });
});

app.post("/delete", (req, res) => {
  const checkedBoxId = req.body.checkedbox;
  const listName = req.body.listName;

  if(listName === day){
    Item.findOneAndRemove({ _id: checkedBoxId }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted the item.");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({listName: listName}, {$pull: {items: {_id: checkedBoxId}}}, (err, doc)=>{
      if(!err){
        res.redirect(`/${listName}`);
      }
    })
  }
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ listName: customListName }, (err, docs) => {
    if (!err) {
      if (!docs) {
        const list = new List({
          listName: customListName,
          items: [item1, item2, item3],
        });

        list.save();
        res.redirect(`/${customListName}`);
      } else {
        res.render("index", {
          listTitle: docs.listName,
          newTodoItems: docs.items,
        });
      }
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.post("/", (req, res) => {
  const todo = req.body.todo;
  const listTitle = req.body.list;

  const item = new Item({
    todo: todo,
  });

  if (listTitle === day) { 
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ listName: listTitle }, (err, docs) => {
        docs.items.push(item);
        docs.save();
        res.redirect(`/${listTitle}`);
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
