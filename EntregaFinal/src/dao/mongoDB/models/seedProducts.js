/*import fs from "fs";
import { productModel} from "./productModel.js";




export const seedFunction = async ()=>{
    try{    
        const products = await fs.promises.readFile("./src/dao/data/products.json","utf-8")
        const productsParse = await JSON.parse(products)
        productModel.insertMany(productsParse);    
    }
    catch(e){
        console.log(e.message);
    }}
*/
