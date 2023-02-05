const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(express.static(__dirname + "/public/"))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/todoItemsDB');

const itemSchema = {
	todo: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
	todo: "Welcome to your to do list"
});

const item2 = new Item({
	todo: "You can start adding your to dos by clicking + button"
});

const item3 = new Item({
	todo: "<-- You can delete todo by clicking this."
});

const today = new Date();
console.log(today);

const options = {
	weekday: 'long',
	day: '2-digit',
	month: 'short',
	year: 'numeric'
}

let day = today.toLocaleDateString('en-US', options);

app.get("/", (req, res)=>{
	Item.find({}, (err, docs)=>{
		if(err){
			console.log(err);
		} else if (docs.length === 0){
			Item.insertMany([item1, item2, item3])
			res.redirect("/");
		} else {
			res.render("index", {listTitle: day, newTodoItems: docs});
		}
	});
});

app.post("/delete", (req, res)=>{
	const checkedBoxId = req.body.checkedbox;
	Item.findOneAndRemove({_id: checkedBoxId}, (err)=>{
		if(err){
			console.log(err);
		} else {
			console.log("Successfully deleted the item.");
		}
	});
	res.redirect("/")
});

app.get("/work", (req, res)=> {
	res.render("index", {listTitle: "Work", newTodoItems: workTodo})
});

app.get("/about", (req,res)=>{
	res.render("about.ejs")
});

app.post("/", (req, res)=>{
	console.log(req.body);
	item = req.body.todo;

	if(req.body.list === 'Work'){
		workTodo.push(item);
		res.redirect('/work')
	}else{
		todoItems.push(item);
		res.redirect("/")
	}
}); 


app.listen(3000, ()=>{
	console.log("Server is Running on Port: 3000");
});

