import { Router } from "express";
import cartDao from "../dao/mongoDB/cart.dao.js";
import productDao from "../dao/mongoDB/product.dao.js";


const router = Router();


//Creación de nuevo carrito.Petición en postman: CrearCarrito.
router.post("/", async (req,res)=>{
    try{
        const nuevo = await cartDao.create();
        if (!nuevo) return res.status(400).json({status:"Error",msg:"No se logró crear el carrito."})
        //Verifico la existencia del carrito por cualquier error inesperado que pudiese impedir su creación.
        res.status(200).json({status:"Success",msg:"El carrito fue creado con éxito."})
    }

    catch(e){
        res.status(500).json({status:"Error",msg:"Error inesperado del servidor."})
        console.log(e.message);
    }})



/*Agrego un producto la carrito. Para ello, debo encontrar el carrito por parámetro y
el producto que también viene por parámetro. Petición en postman: AgregoProductoACarrito  */
router.post("/:cid/product/:pid", async (req,res)=>{
    try{
        let {cid,pid} = req.params
        const product = await productDao.getById(pid);
        if (!product) return res.status(404).json({status:"Error",msg:"No se ha encontrado el producto."})//Verifico su existencia en la DB, no por stock, sino si está dado de alta.
        
        const cart = await cartDao.getById(cid);
        if (!cart) return res.status(400).json({status:"Error",msg:"No se encontró el carrito."})//Verifico la existencia del carrito.
        
        const carritoVerificado = await cartDao.addProductToCart(cid,pid); //Ya lo devuelve actualizado.
        
        res.status(200).json({status:"Success",msg:"El carrito fue actualizado con éxito.",carritoVerificado})

    }
    catch(e){
        res.status(500).json({status:"Error",msg:"Error inesperado del servidor."})
        console.log(e.message);
    }})



//Elimino un producto del carrito. Es similar al agregado. Petición en postman: removerProductoDelCarrito.
router.delete("/:cid/products/:pid", async (req,res)=>{
    try{
        let {cid,pid} = req.params;
        const cart = cartDao.getById(cid)   //Busco el carrito que ingresa el Front por parámetro.
        if (!cart) return res.status(400).json({status:"Error",msg:"No se encontró el carrito."}) //Verifico su existencia.
        
        const cartUpdated = await cartDao.removeProductFromCart(cid,pid)//Explicado en cart.dao.js.
        res.status(200).json({status:"Success",msg: cartUpdated})
    }
    catch(e){
        console.log(e.message);
        res.status(404).json({status:"Error",msg:"Error inesperado en el servidor."})
    }
})



//Muestro todos los carritos creados a este momento. Petición en postman: MostrarCarritos
router.get("/",async (req,res)=>{
    try{
        const cart = await cartDao.getAll();
        res.status(200).json({status:"Succes",payload:cart})
        console.log("Mostrando carritos")
        console.log(cart)
    }
    catch(e){
        res.status(500).json({status:"Error",msg:"Error inesperado del servidor."})
        console.log(e)
    }})



/*Obtengo un carrito por id. Cuando lo busco por id el método getById utiliza el método populate,
lo que me permite "abrir" el grado de detalle de cada id de producto mostrando todos sus campos.
Petición en postman: MostrarCarrito */
router.get("/:cid",async (req,res)=>{
    try{
        const {cid} = req.params
        let cart = await cartDao.getById(cid)
        if (!cart) return res.status(400).json({status:"Error",msg:"El carrito buscado no se encuentra"})//Verifico si existe el carrito.
        res.status(200).json({status:"Succes",payload:cart})
        console.log("Mostrando carrito")
    }
    catch(e){
        res.status(500).json({status:"Error",msg:"Error inesperado del servidor."})
        console.log(e)
    }})


/*Acutalizo el stock de un producto.Recibo la cantidad por el body desde el front,
 url params para identificar carrito y producto, desde allí enviamos quantity
al método de actualización. Petición postman: ModificarQuantity.*/
router.put("/:cid/products/:pid", async (req,res)=>{
    try{
        let {cid,pid} = req.params; //Tomo id de producto y de carrito.
        let {q} = req.body;     //Tomo el objeto q con el dato para reemplazar en quantity.
        const cart = cartDao.getById(cid)
        if (!cart) return res.status(400).json({status:"Error",msg:"No se encontró el carrito."}) //Verifico su existencia.

        const product = productDao.getById(pid);
        if (!product) return res.status(400).json({status:"Error",msg:"Producto no existente."})//Verifico su existencia.

        const cartUpdated = await cartDao.updateProductFromCart(cid,pid,q) //Envío id de carrito, de producto, y campo de reemplazo para quantity.
        res.status(200).json({status:"Success",msg: cartUpdated})
    }
    catch(e){
        console.log(e.message);
        res.status(404).json({status:"Error",msg:"Error inesperado en el servidor."})
    }})



//Vaciamos el carrito.Peiticón de postman: VaciarCarrito.
router.delete("/:cid",async (req,res)=>{
    try{
        const {cid} = req.params
        let cart = await cartDao.getById(cid)
        if (!cart) return res.status(400).json({status:"Error",msg:"El carrito buscado no se encuentra"})//Verificamos que existe.
        
        const updatedCart = await cartDao.emptyCart(cid) //Explicado en cartDao.js.
        
        res.status(200).json({status:"Succes",payload:updatedCart})
        console.log("Mostrando carrito vacío.")
    }
    catch(e){
        res.status(500).json({status:"Error",msg:"Error inesperado del servidor."})
        console.log(e)}})


export default router;