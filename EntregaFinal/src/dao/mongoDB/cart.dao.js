//Manejamos la conexión directa con la base de datos,reemplazarìa las
//funciones que usamos para la local, el getcarts(),etc.
import { cartModel } from "./models/cartModel.js";




//Me da todos los carritos. Podría usar paginate, pero no es solicitado.
const getAll = async ()=>{
    const carts = await cartModel.find();
    return carts;
}


//Obtengo un carrito buscado por id y lo muestro. De no encontrarse dejo un string de advertencia.
const getById = async (id)=>{
    const cart = await cartModel.findById(id).populate("products.product");//Desglosa el id de cada producto en sus atributos al mostrarse.
    return cart;
}



//Creo un carrito y lo devuelvo.
const create = async ()=>{
    const newcart = await cartModel.create({});//Por una cuestión del método de Mongo, debo enviarle un objeto vacío.
    return newcart;
}


//Actualizo un carrito y lo devuelvo actualizdo.
const update = async (id,data)=>{
    await cartModel.findByIdAndUpdate(id,data); //Este mètodo no devuelve automàticamente el carrito actualizado, te da el viejo, por eso debemos buscar por id luego del update.
    const updatedcart = await cartModel.findById(id);
    return updatedcart;
}


//Elimino definitivamente un carrito.
const deleteCart = async (id)=>{
    const deletedcart = await cartModel.deleteOne({_id:id});
    return deletedcart;
}
/*El método de mongo me indica que debo enviar la clave automática que define el id del producto,
está definida por Mongo.
A diferencia de los productos, los carritos si son eliminado definitivamente.*/





/*Agrego un producto al carrito. Necesito el id de carrito y producto para actuar sobre la información
que corresponde en la DB.*/
const addProductToCart = async (idcart,idProducto)=>{
    const cart = await cartModel.findById(idcart)
    //Puedo trabajar desde la variable cart siendo un elemento de la DB, por eso tiene sentido usar el método save().

    //Busco la posición del producto que quiero eliminar.Utilizo el método valueOf() para comparar string vs string.
    const index = cart.products.findIndex((prod)=>prod.product.valueOf()===idProducto)


    //Si no la encuentro, pusheo un producto nuevo al carrito con la cantidad en 1.
    if (index == -1) {
        cart.products.push({product:idProducto,quantity:1});}

    //Si la encuentro, aumento su cantidad en la posición encontrada en el campo quantity.
    else{
        cart.products[index].quantity++;}


    await cart.save();//lo guardo directamente en la DB de mongo.
    return cart;
}



//Similar razonamiento a adherir un producto al carrito, pero en este caso piso el arreglo de productos con el 
//mismo arreglo pero filtrado, sin tener en cuenta la coincidencia de idProducto buscada para eliminar.
const removeProductFromCart = async (idcart,idProducto)=>{
    const cart = await cartModel.findById(idcart)//Ya verifique su existencia en la ruta que invoca esta función.

    const index = cart.products.findIndex((prod)=>prod.product.valueOf()===idProducto)
    if (index == -1) {return("El producto no se encuentra en el carrito.")}
    else{
        if (cart.products[index].quantity>1){cart.products[index].quantity--}//Bajo stock en 1
        else {cart.products = cart.products.filter((p)=>p.product.valueOf()!==idProducto)}}//Si el campo quantity era 1, debo eliminar el producto.

    await cart.save();//lo guardo directamente en la DB de mongo.
    
    return cart;
    }


//Actualización del producto en le carrito.
const updateProductFromCart = async (idcart,idProducto,q)=>{
    const cart = await cartModel.findById(idcart)
    //No valido su existencia ya que se verifica en la ruta que invoca a ésta función. (put("/:cid/products/:pid"))

    const index = cart.products.findIndex((prod)=>prod.product.valueOf()===idProducto)
    if (index == -1) {
        return("El producto no se encuentra en el carrito.")}
    else{
        cart.products[index].quantity= Number(q)};//Actualización del campon, en formato número, o daría error por ser un string.


    await cart.save();//lo guardo directamente en la DB de mongo.

    return cart;
    }


//Elimino todos los productos del carrito.    
const emptyCart = async (idcart)=>{
    const cart = await cartModel.findById(idcart)
    //No valido su existencia ya que se verifica en la ruta que invoca a ésta función.

    cart.products = [];//Piso el carrito de la DB directamente en su campo products, que es donde van los productos, con un arreglo vacío.
    await cart.save();//lo guardo directamente en la DB de mongo.

    return cart;
    }


export default {getAll,
    getById,
    create,
    update,
    deleteCart,
    addProductToCart,
    removeProductFromCart,
    updateProductFromCart,
    emptyCart};