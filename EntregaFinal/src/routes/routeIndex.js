import { Router } from "express";
import routeProducts from "./routeProducts.js";
import routeCarts from "./routeCarts.js";




const router = Router();


router.use("/products",routeProducts);

router.use("/carts",routeCarts);


/*La idea de usar el index route es centralizar varias subrutas de 
una misma ruta raíz. */




export default router;