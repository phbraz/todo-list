const express = require("express"); 
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));


//one per each path if you want to
const items = [
        "Play Games", 
        "Buy a game",
        "Get an existial crisis",
    ];
const workItems = [];    


//home page localhost:3000/

app.get("/", (req, res)=>{
    let day = date.getDate();

    res.render("list", {listTitle: day, newListItems: items});

});



app.post("/", (req, res)=>{    
    let item = req.body.newtodo;

    //some logic to determine in which array we should save our item based on route
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");                
    }
    else{
        items.push(item);
        res.redirect("/");
    }

});


// work todo list page localhost:3000/work

app.get("/work", (req, res)=>{

    res.render("list", {listTitle: "Work List", newListItems: workItems });

});


app.post("/work", (req, res)=>{
    let item = req.body.newListItems;
    workItems.push(item);

    res.redirect("/work");
});


//about page localhost:3000/about

app.get("/about", (req,res)=>{
    res.render("about");

});

app.listen(3000, ()=>{
    console.log("server started at port 3000");
});