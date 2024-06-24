let products = [];

import fs from "fs";

const pathFile = "./src/data/products.json";

const addProduct = async (product) => {
  await getProducts();
  const { title, description, price, thumbnail, code, stock, category } = product;
  const newProduct = {
    id: products.length + 1,
    title,
    description,
    price,
    thumbnail: thumbnail || [],//Si no viene por parámetro debo definir su contenido vacío para que no quede undefined.
    code,
    stock,
    category,
    status: true
  };

  products.push(newProduct);

  await fs.promises.writeFile(pathFile, JSON.stringify(products));

  return product;
};

const getProducts = async (limit) => {
  const productsJson = await fs.promises.readFile(pathFile, "utf8");
  const productsParse = JSON.parse(productsJson);
  
  products = productsParse || []; //Cuando el archivo no ha sido creado, simplemente devuelvo un arreglo vacío, significa q el archivo aún no ha sido creado.
  
  if (!limit) return products;

  return products.slice(0, limit);
};

const getProductById = async (id) => {
  products = await getProducts();
  const product = products.find((p)=> p.id === id);

  return product;
};

const updateProduct = async (id, productData) => {
  await getProducts();

  const index = products.findIndex((p) => p.id === id);
  if (!index) return index;
  products[index] = {
    ...products[index],
    ...productData,
    id:id//Me aseguro que el id siga siendo el mismo, por si viene nueva información en el body.
  };

  await fs.promises.writeFile(pathFile, JSON.stringify(products));
  const product = await getProductById(id);
  return product;
};

const deleteProduct = async (id) => {
  await getProducts();
  const product = await getProductById(id);
  if (!product) return false;
  products = products.filter((p) => p.id !== id);
  await fs.promises.writeFile(pathFile, JSON.stringify(products));

  return true;
};

export default {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};