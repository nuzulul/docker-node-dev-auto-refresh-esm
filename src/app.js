const env = process.env.NODE_ENV || "development";
const port = normalizePort(process.env.PORT || '8080');

import express from "express";
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";

var app = express();

if (env === "development") {
	
	const livereload = await import("livereload");
	const connectLiveReload = await import("connect-livereload");
	
	const liveReloadServer = livereload.createServer();
	liveReloadServer.server.once("connection", () => {
	  setTimeout(() => {
		liveReloadServer.refresh("/");
	  }, 100);
	});
    app.use(connectLiveReload.default());
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


//routes
app.use("/", indexRouter);
app.use("/api", apiRouter);

//catch 404
app.use(function(req, res, next) {
  res.status(404)

  // respond with html page
  if (req.accepts('html')) {
    res.render('error', { message: "404 Not Found" });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
