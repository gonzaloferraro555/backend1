//Manejamos la conexión directa con la base de datos,reemplazaría las
//funciones que usamos para la local, el getProducts(),etc.
import { productModel } from "./models/productModel.js";



//Obtengo todos los productos en base a la personalización de búsqueda.
const getAll = async (query,options)=>{
    const products = await productModel.paginate(query,options);
    return products;
}

    /*Debe tenerse en cuenta que usar el método paginate, modifica la devolución,
    ya que el formato devuelto tendrá datos de la búsqueda, incluidas las páginas 
    existentes, el limit, y un campo docs, que representa un arreglo, donde estarán
    contenidos todos los datos encontrados. Si quiero operar sobre los datos de la búsqueda,
    debo tener en cuenta que debo acceder a los productos a través del campo docs.
    El primer parámetro tiene el filtrado de búsqueda, y el segundo el seteado 
    para mostrar la paginación. */



//Obtengo un producto en base a su id autogenerado por MongoDB. De no existir devuelve un string de advertencia.
const getById = async (id)=>{
    const product = await productModel.findById(id);
    return product;
}


//Crea un producto en base al schema y a la data reicbida desde la url, la cual debe coincidir según las especificaciones de la API.
const create = async (data)=>{
    const newProduct = await productModel.create(data);
    return newProduct;
}



//Actualiza el prdoucto, debe encontrarlo primero, lo resuelve el método de Mongoose, devuelvo la actualización.
const update = async (id,data)=>{
    await productModel.findByIdAndUpdate(id,data); //Este mètodo no devuelve automàticamente el producto actualizado, te da el viejo, por eso debemos buscar por id luego del update.
    const updatedProduct = await productModel.findById(id);
    return updatedProduct;
}



//Elimina el producto según su id. Implica modificar su campo status, no se da definitivamente de baja.
const deleteProd = async (id)=>{
    await productModel.findByIdAndUpdate(id,{status:false});//Porque no elimino realmente, cambio su status.
    const deletedProduct = await productModel.findById(id);
    return deletedProduct;//Lo devuelvo porque al tratar la devolución consulto por si devuelve algo o esta undefined, caso en el cual no habrá sido encontrado.
}



export default {getAll,
    getById,
    create,
    update,
    deleteProd};