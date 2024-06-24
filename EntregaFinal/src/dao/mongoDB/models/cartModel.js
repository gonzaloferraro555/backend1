import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";



const collectionCart = "Carritos";

const cartSchema = new mongoose.Schema({
     products:{
        type:[{product:{type:mongoose.Schema.Types.ObjectId, ref:"Productos"},quantity: Number}]
    }})

    cartSchema.plugin(mongoosePaginate);

    export const cartModel = mongoose.model(collectionCart,cartSchema);
    

