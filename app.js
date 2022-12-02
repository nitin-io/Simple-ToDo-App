const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(__dirname + "/public/"))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());

let todoItems = [];
let workTodo = [];


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
	res.render("index", {listTitle: day, newTodoItems: todoItems});
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

