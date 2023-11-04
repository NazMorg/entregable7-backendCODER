import express from 'express';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import viewsRouter from './routers/views.router.js';
import usersRouter from './routers/users.router.js';
import session from 'express-session';
import mongoStore from 'connect-mongo';
import passport from 'passport';
import './db/dbConfig.js';
import './middlewares/passport.middleware.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//session
const URI = 'mongodb+srv://morgadonazareno:vjUsUjQwwh4R2lSj@entregables.6ebvcie.mongodb.net/entregables?retryWrites=true&w=majority&appName=AtlasApp';
app.use(session({
    secret: "SECRETSESSIONKEY",
    cookie: {
        maxAge: 600000,
        signed: true,
    },
    store: new mongoStore({
        mongoUrl: URI,
    })
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando puerto ${PORT}...`);
});

const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
})