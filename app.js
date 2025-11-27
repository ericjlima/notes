var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var http = require('http');
var socketIo = require('socket.io');

var indexRouter = require('./routes/index');
var notesRouter = require('./routes/notes');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var sessionsRouter = require('./routes/sessions');
var searchRouter = require('./routes/search');
var passwordRouter = require('./routes/password');
var scoreboardRouter = require('./routes/scoreboard');
var themeRouter = require('./routes/theme');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(
  cors({
    origin: ['https://ericnote.us', 'https://www.ericnote.us'],
    credentials: true,
  }),
);

app.use(bodyParser.json({limit: '50mb'}));
app.use(
  bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}),
);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app); // Create server
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000','https://ericnote.us', 'https://www.ericnote.us'],
    methods: ["GET", "POST"]
  }
}); // Initialize Socket.IO with the server

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/notes', notesRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/search', searchRouter);
app.use('/api/signup', signupRouter);
app.use('/api/password', passwordRouter);
app.use('/api/theme', themeRouter);
app.use('/api/scoreboard', scoreboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  })

  socket.on("send_message", (data) => {
    console.log("data", data);
    

    socket.to(data.room).emit("receive_message", data);
    //socket.broadcast.emit("receive_message", data);
  })
})

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, function () {
  console.log('Express server listening on port %d', port);
});

if (!module.parent) {
  app.listen(port, host, function () {
    console.log(
      'Express server listening on port %d in %s mode',
      app.address().port,
      app.settings.env,
    );
  });
}

module.exports = app;
