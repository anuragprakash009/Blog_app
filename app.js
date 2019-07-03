var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParse:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({exteded: true}));
app.use(methodOverride("_method"));
//Mongo
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);


//RESTful Routes
app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("Error!");
		}else{
			res.render("index",{blogs:blogs});
		}
	})
	
});
app.get("/blogs/new",function(req,res){
	res.render("new");
});
app.post("/blogs",function(req,res){
	Blog.create(req.body.blog, function(err,newBlog){
		if(err)
		{
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,found){
		if(err)
		{
			res.redirect("/blogs")
		}else{
			res.render("show",{blogs:found})
		}
	});
});
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,found){
		if(err)
		{
			res.redirect("/blogs");
		}else{
			res.render("edit",{blogs:found});
		}
	});
});

app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,update){
		if(err)
		{
			res.redirect("/blogs")
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

app.listen(3000,process.env.IP,function(){
	console.log("SERVER IS RUNNING !");
});