import {response,request} from "express";
import productDao from "../dao/mongoDB/product.dao.js";//Paso a adaptar el mètodo del middleware usando las funciones que gestionan la DB.



export  const checkProduct = async (req=request,res=response, next)=>{
    try{   
        //Tomo el producto del body como me convenga para validarlo, y creo un producto temporario para ver si lo parámetros son válidos. 
        const { title, description, price,  code, stock, category } = req.body; //sale de la url en la que use el checkProduct
        let productValidation = {
            title,
            description,
            price,
            code,
            stock,
            category}
        //no incluyo thumbnail para la validación porque no es obligatorio que tenga valor, me encargo en el schema de productos de asegurar un valor default, pero
        //puede venir vacío esa key en el body, por lo tanto no la incluyo en la verificación.
        if (Object.values(productValidation).includes(undefined)) return res.status(400).json({status:"Error",msg:"Todos los campos a excepción de thumbnails son obligatorios."})
        const products = await productDao.getAll();
        if (products.docs.length>0){
            const codigo = products.docs.find((p)=>p.code===code)
            if (codigo) return res.status(400).json({status:"Error",msg:"Ya existe un producto con ese código,"})}
        next();}

    catch(e){
        console.log("Error: ",e.message);
        res.status(500).json({status:"Error",msg:"Error interno en el servidoRR.."})}
    
    }







