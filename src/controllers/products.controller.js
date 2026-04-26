const productModel = require('../models/product.model');

async function getProducts(req, res) 
{
  try 
  {
    //here we just call the model function to get all products
    const result = await productModel.getAllProducts();
    res.json(result);
  } 
  
  catch (error) 
  {
    res.status(500).json({ error: error.message });
  }
};

async function getProductById(req, res) {
  try {

    const id = req.params.id;

    const product = await productModel.getProductById(id);

    if (!product) {
        return res.status(404).json({message:"Producto no encontrado"});
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({error:error.message});

  }
}

module.exports = {getProducts, getProductById};