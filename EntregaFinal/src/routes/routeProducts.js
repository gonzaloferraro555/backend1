import {Router} from "express";
import { checkProduct } from "../middleware/checkProduct.js";
import productDao from "../dao/mongoDB/product.dao.js";

const router = Router()


//Muestro los productos paginados. Petición de postman: MostrarProductos.
router.get("/", async (req,res)=>{
    try{
        const {limit,page,sort,category,status} = req.query;
        /*El limit no limita la cantidad general, sino la cantidad
        a mostrar por página. De esta manera, la consulta es sobre
        10 elementos por página, y puedo también seleccionar
        que págino deseo ver. Pasar a otra página, será otra búsqueda en la DB,
        pero de esta manera elijo cuantos elementos mirar y ahorro búsquedas que consuman muchos
        recursos innecesariamente. */
        
        //Definimos los datos de la búsqueda requeridos. Esta información alimenta el pedido getAll() especificando la solicitud.
        const options = {
            limit:limit || 10,
            page: page || 1,
            sort:{
                price:sort==="asc" ? 1:-1,
                //defino el campo de ordenamiento y si será asc o desc con un operador ternario.
            },
            learn:true}
        
        //si viene una categoría, buscamos utilizandola como filtro.
        /*La configuración del a query es una constante que debemos
        definir para darle forma a las busquedas en gran cantidad de elementos
        en nuestra DB. */
        if (category) {
            const product = await productDao.getAll({category},options)
            return res.status(200).json({status:"Succes",payload:product})}//Muestro filtrando por categoria.
        if (status){
            const product = await productDao.getAll({status},options);
            return res.status(200).json({status:"Succes",payload:product})}
            /*Muestro filtrando por los productos habilitados en status=true, 
            que es su valor por default. Si ya no se vende ese producto, lo dejo inhabilitado
            dándole false al campo, para que no sea suceptible de ser mostrado por el front para la venta.
            Su información no se elimina por completo.*/

        const product = await productDao.getAll({},options);
        return res.status(200).json({status:"Succes",payload:product});
        /*MUestro todos los productos sin filtrado, enviando query vacío, pero respetando las 
        especificaciones de paginación definidas en la constante "options". */
    }

    catch(e){
        res.status(500).json({status:"Error",msj:"Error Interno del servidor."})
        console.log(e.message);}})



/*Petición en postman: MostrarUnProducto */
router.get("/:pid",async (req,res)=>{
    try{
        
        const {pid} = req.params; //Desestructuro el objeto que viene como parámetro.
        let producto = await productDao.getById(pid);
        if (!producto) return res.status(404).json({state:"Error",msg:"El producto no ha sido encontrado."})//Verifico su existencia.
            
        res.status(200).json({state:"success",producto})

    }
    catch(e){
        res.status(500).json({status:"Error",msg:"Error inesperado del servidor."})
        console.log(e);
    }})


/*Agrego un producto para ser posible de comprar. No es lo mismo que habilitarlo en status:true, 
aquí definimos sus características. Petición en postman: CrearProducto*/
router.post("/",checkProduct, async (req,res)=>{
    try{
        const product  = req.body; //Tomo los valores de los campos definidos en el productSchema desde el front.
        await productDao.create(product)
        res.status(200).json({status:"Success",product})
    }
    catch(e){
        res.status(500).json({status:"success",msj:"Error inesperado en el servidor."})
        console.log(e);
    }})


/*Actualizo producto. Petición en postman: ModificarProducto. */
router.put("/:pid", async(req,res)=>{
    try{    
        const {pid} = req.params
        const update = req.body //No desestructuro porque necesito el objeto de actualización entero, para el spread.
        
        let producto = await productDao.update(pid,update);//El id en Mongo deja de ser un nùmero, es un string autogenerado de clave primaria.
        if (!producto) return res.status(400).json({status:"Error",msg:"No se ha encontrado el producto."})//Verifico su existencia.

        res.status(200).json({status:"Success",msg:`Modificación realizada con éxito. ${producto}`})

    }
    catch(e){
        res.status(500).json({status:"Error",msg:"Error interno del servidor."})
        console.log(e);
    }})


//Eliminar producto. Petición en postman: EliminarProducto.
router.delete("/:pid",async (req,res)=>{
    try{    
        const {pid} = req.params;
        if (productDao.deleteProd(pid))  return res.status(200).json({status:"success",msg:"Producto eliminado con éxito."})
        /* Si la devolución de la función deleteProd tiene valor, entonces se habrá validado la operación.
        De lo contrario, continúo a advertir de la inexistencia del producto al front. */
        res.status(400).json({status:"Error",msg:"No se ha encontrado el producto que desea eliminar."})}
        
    catch(e){
        res.status(500).json({status:"Error",msg:"Error inesperado del servidor."})
        console.log(e);
    }})



export default router;