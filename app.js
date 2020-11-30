const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

//mongoose for our nosql db 
const mongoose = require("mongoose");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://phbraz:Patrycja0304@cluster0.95eou.mongodb.net/todoListDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

//item schema
const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        }
    });

//Model 
const Item = mongoose.model("Item", itemSchema);

//default items in our collection
const items1 = new Item(
    {
        name: "Welcome To your todo List"
    });

const items2 = new Item(
    {
        name: "Hit + button to add a new Item"
    });

const items3 = new Item(
    {
        name: "<-- Hit this to delete an item"
    });

const defaultItems = [items1, items2, items3]

//list schema

const listSchema = new mongoose.Schema(
    {
        name: String,
        items: [itemSchema]
    });
    
//model    
const List = mongoose.model("List", listSchema);


//home page localhost:3000/

app.get("/", (req, res) => {

    Item.find({}, (err, foundItems) => {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);

                } else {
                    console.log("Default items have been added!");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    });

});

//any path 

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, (err, foundList)=>{
        if(!err){
            if(!foundList){
                //create a new list

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/"+customListName);
            }else{
                
                //show existing list
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }

    });

});


app.post("/", (req, res) => {
    const itemName = req.body.newtodo;
    const listName = req.body.list;

    const newItemRequested = new Item(
        {
            name: itemName
        });

    if (listName === "Today") {

        newItemRequested.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, (err, foundList)=>{
            foundList.items.push(newItemRequested);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

//delete items

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove({ _id: checkedItemId }, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
            }
        });

    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList)=>{
            if(!err){
                res.redirect("/"+ listName);
            }

        });
    }
});

//about page localhost:3000/about

app.get("/about", (req, res) => {
    res.render("about");

});

let port = process.env.PORT;
if (port == null || port =="") {
    port=3000;   
}

app.listen(port, () => {
    console.log("server started successfully");
});