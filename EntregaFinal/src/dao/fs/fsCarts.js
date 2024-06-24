import fs from "fs";

let carts = [];
const pathFile = "./src/data/carts.json";

const getCarts = async () => {
  const cartsJson = await fs.promises.readFile(pathFile, "utf-8"); //Si el archivo no existe, no da error?. 
  const cartsPars = JSON.parse(cartsJson);
  carts = cartsPars || [];

  return carts;
};

const createCart = async () => {
  await getCarts();
  const newCart = {
    id: carts.length + 1,
    products: [],
  };

  carts.push(newCart);

  await fs.promises.writeFile(pathFile, JSON.stringify(carts));
  return newCart; //Siempre devuelvo el carrito creado para verificar en una línea su creación en el código de la ruta.
};

const getCartById = async (cid) => {
  
  await getCarts();
  const cart = carts.find((c) => c.id === cid);
  return cart;
};

const addProductToCart = async (cid, pid) => {
  await getCarts();
  const product = {
    product: pid,
    quantity: 1,
  };

  const index = carts.findIndex((cart) => cart.id === cid); //No verifico si encuentra el carrito, porque lo chequeo en la ruta de carts antes de usar la función addProductToCart.
  let index2 = carts[index].products.findIndex((p)=>p.product===pid)
  console.log(index2)
  console.log(pid)
  if (index2!=-1){carts[index].products[index2].quantity++}
  else
  {
  carts[index].products.push(product);}


  await fs.promises.writeFile(pathFile, JSON.stringify(carts));
  
  return carts[index];
};

export default {
  getCarts,
  getCartById,
  addProductToCart,
  createCart,
};