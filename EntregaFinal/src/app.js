import express from "express";
import routerIndex from "./routes/routeIndex.js";
import {mongoDBConnect} from "./config/mongoDB.config.js";
//import { seedFunction } from "./dao/mongoDB/models/seedProducts.js";


//Obtengo en app la variable que levanta el servidor.
const app = express();

//Conexión a la DB definida en la carpeta config.
mongoDBConnect();

//Definición del puerto.
let PORT =8080;


//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//Manejo del enrutado para mayor simpleza de lectura en el código.
app.use("/api",routerIndex);

//seedFunction(); 
//Dejo comentado el agregado general de 18 productos que fue ejecutado por única vez.

//Configuración del puerto que usará el servidor y mensaje por consola.
const server = app.listen(PORT,()=>{
    console.log(`Escuchando solicitudes vía el puerto ${PORT} `);

});

