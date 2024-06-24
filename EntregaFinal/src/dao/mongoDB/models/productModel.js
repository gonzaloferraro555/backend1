import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const collectionProduct = "Productos";

const productSchema = new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    thumbnail:{
        type:Array,
        default:[]},
    code:Number,
    stock:Number,
    category:String,
    status:{
        type:Boolean,
        default:true,
    }})

    //Dejarle un valor por default implica asegurarse que es una clave que puede no estar 
    //ingresada al crear el producto, es decir no venir definida en el post.

productSchema.plugin(mongoosePaginate);
//Permite mostrar productos con búsqueda personalizada para este Schema, filtrando grandes cantidades de datos para no 
//realizar solicitudes pesadas.


export const productModel = mongoose.model(collectionProduct,productSchema);




/*Como aquì no viene un paràmetro como argumento que alimente la clave "thumbnails",
no puedo darle un valor "argumento" o [] como hice anteriormente. Se define de la manera
detallada, un objeto con un campo que define el tipo, y otro que le da el valor por default. La 
duda es, porquè no lo define como arreglo vacìo directamente, si siempre se crearà vacìo.

El status en true tiene una razòn de ser. 
Cuando tengo que eliminar un usuario por ejemplo, no tengo que eliminarlo de la DB,
porque suele ser informaciòn asociada a otros datos, y eliminar el usuario podrìa romper
la DB, por eso la eliminaciòn del usuario es como una dada de baja, pero el usuario
no suele eliminarse completamente de la DB. (Un ejemplo son los comentarios asociados a mi 
cuenta de instagram, si doy de baja mi usuario, podrìa dar error o undefined en los comentarios
que me han referido. Para evitar eso las cuentas y usuarios nunca se borran, por eso es posible
recuperarla). El status, es el dato que paso a false, si doy de baja el usuario, de esa forma
el dato persiste en la memoria, pero està dado de baja. */



