const express = require('express');

//to access form data
let bodyParser = require('body-parser');

//used to reduce response body
let compression = require('compression');

//to access server directories
let path = require('path');

//to access the database stored in MongoDB
let mongoose = require('mongoose');

//session allows to store data such as user data
let session = require('express-session');

//sessions are stored into MongoDB
const MongoStore = require('connect-mongodb-session')(session)

let cors = require('cors');

const app = express();

//Used for Jsonwebtoken (in login)
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const Message = require("./models/message");

app.use(express.static(path.join(__dirname, 'public')));

//used to fetch the data from forms on HTTP POST, and PUT
app.use(bodyParser.urlencoded({

    extended : true
  }));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'mySecretKey',
    store: new MongoStore({ url: 'mongodb://localhost:27017/auth', autoReconnect: true})
  }));

app.get('/accueil', (req, res) => {
    res.sendFile(__dirname + '/view/accueil.html');
});
app.get('/connected', (req, res) => {
    console.log(req);
    res.sendFile(__dirname + '/view/connected.html');
});

let routes = require("./routes");

const message = require('./models/message');

app.use(routes);

app.use(bodyParser.json());

//connects to the MongoDB database
mongoose.connect('mongodb://localhost:27017/auth', (err) => {
    if (err) {
        throw err;
    }
    else {

        console.log("Connected to the database");
    }
});



  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = "My so secret sentence";
  
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      User.findById(jwt_payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }, (err) => {
        return done(err, false);
      });
  }));
  
  app.use(passport.initialize());

const  connect  =  mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true  });
module.exports  =  connect;

//compress response body for better performance
app.use(compression());

app.use(cors());

//disable headers indicating pages are coming from an Express server
app.disable('x-powered-by');


io.on('connection', (socket) => {
    socket.on('chat message', (msg, username) => {
        io.emit('chat message', msg, username);
    });
});


io.on("connection", socket => {
    console.log("user connected");
    socket.on("chat message", function (msg, user) {
        console.log("user: " + user);
        console.log("message: " + msg);
        
        socket.broadcast.emit("received", { message: msg });

        //save chat to the database
        connect.then(db => {
            console.log("connected correctly to the server");
            let chatMessage = new Message({ content: msg, sender: user});
            chatMessage.save();
        });
    });
});




server.listen(3000, () => {
    console.log('listening on :3000');
});