const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(__dirname + "/public/"))
app.set('view engine', 'ejs');


const today = new Date();
console.log(today);

const countDay = (dayNum) => {
	switch(dayNum) {
	case 0:
			return "Sunday"
			break;
	case 1:
			return "Monday"
			break;
	case 2: 
			return "Tuesday"
			break;
	case 3:
			return "Wednesday"
			break;
	case 4:
			return "Thursday"
			break;
	case 5:
			return "Friday"
			break;
	case 6:
			return "Saturday"
			break;
	default:
			break;
	}
}

const day = countDay(today.getDay());


app.get("/", (req, res)=>{
	res.render("index", {kindOfDay: day});

});

app.listen(3000, ()=>{
	console.log("Server is Running on Port: 3000");
});
