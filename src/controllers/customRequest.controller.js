const customRequest = require('../models/customRequest.model');
const {getUserByEmail} = require('../models/createNewOrder.model');


//here we import the router module and the result of the query(model) to create a custom request
async function createRequest(req, res)
{
  try 
  {  //we get the user from the session to use it later
        const email = req.session.user.email;
        const userRaw= await getUserByEmail(email);
        const userID = userRaw.id_cliente;


      //here we wait forthe user to send the data through the body, then we validate if the required data is present
      const { productType, instructions, imageFileName, imageBase64} = req.body;
      console.log('Received custom request data:', req.body);
      //if theres any field left to fill we send an error message
      if (!productType || !imageFileName || !instructions || !imageBase64) 
      {
        throw new Error('Faltan datos obligatorios.');
        return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
      }
      await customRequest.createRequest(productType, instructions, imageFileName, imageBase64,userID);

      res.json({ success: true, message: 'Solicitud enviada correctamente.¡Pronto te contactaremos!' });  } 
  catch (error) 
  {
    console.log('Error creating custom request:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

async function showImageCustom(req, res)
{
  try
  {
    const { id_solicitud } = req.params;
    const data = await customRequest.getImageCustomRequest(id_solicitud);
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: "Solicitud no encontrada" });
    }
    //console.log(image)
    res.json({ success: true, 
      data:{
      json_disenio: data.json_disenio,
      instrucciones: data.instrucciones,
      tipo_producto: data.tipo_producto,
      fecha_solicitud: data.fecha_solicitud
    } });
  }
  catch (error)  {
    console.log('Error showing custom request image:', error);
    res.status(500).json({ success: false, message: error.message });
  }

}

module.exports = { createRequest , showImageCustom};