var express= require("express");
var nunjucks = require("nunjucks");
var app= express();
var fs = require ("fs");
var datos = require("./datos.json");
var path = require("path");

app.use(express.static(path.join(__dirname, "public")))

var env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true,
    noCache: false
});

app.engine("html", nunjucks.render);
app.set("view engine", "html");

app.get("/datos", function(req, res){
	res.json (datos);
})

app.get("/", function(req, res){
	res.render("layouts/index.html");
});

app.get("/registro", function(req, res){
	res.render("layouts/registro.html");
});

app.get("/dashboard*", function(req, res){
	res.render("layouts/Dashboard.html");
});

app.get("/user/:name", function(req, res){
	res.render("layouts/Dashboard.html",{
		user: req.params.name
	});
});

app.listen(3000);