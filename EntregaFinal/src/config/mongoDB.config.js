import mongoose from "mongoose";

/*Conexion con la DB de mongo, implica o acceder a una DB existente, o a 
crearla en su defecto. Requiero de mis credenciales de la página de MongoDb.*/
export const mongoDBConnect = async ()=>{
    try {
        mongoose.connect("");
        console.log("Conectado a MongoDB.")//Siempre aviso por consola para que el desarrollador de backend tenga guía de lo que va sucediendo.
    }
    catch(e){
        console.log(`${e.message}`);        
    }
}