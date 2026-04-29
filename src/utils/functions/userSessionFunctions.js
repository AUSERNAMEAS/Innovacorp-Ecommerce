function saveUserSessionFunction(req, email,rol = 'cliente')
{
    //made it promise so we can use await
    return new Promise((resolve, reject) => {
        req.session.user={
        email,
        rol,
        logged: true
    }

     req.session.save((err)=>{
        if (err)        {
            console.log('Error saving session:', err);
            reject(err);
        } else {
            console.log('Session saved successfully');
            resolve();
        }
    });

    });

   


}

function deleteUserSessionFunction(req,res)
{
    req.session.destroy((err)=>{
        if (err)
        {
            console.log('Error destroying session:', err);
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión.' });
        }

        res.clearCookie('connect.sid');
        console.log('User session destroyed');
        res.redirect('/html/FakeShop.html'); // redirect to home page after session deletion
    });
}

function verifySessionFunction(req, res, next) {
  //console.log('--- MIDDLEWARE ---');
  //console.log('Cookies:', req.headers.cookie);
  //console.log('Session:', req.session);
  
  if (req.session.user && req.session.user.logged) 
 { 
    //we use next to continue with the request,this is just a middleware
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'no user session found, please log in to continue.'
  });
}

function verifyAdminFunction(req, res, next) {
    if (req.session && req.session.user.rol === 'Administrador') {
        // if they are an admin,let them
        next(); 
    } else {
        // someone tryin to access to admin route without being admin, we log it and give them the boot
        console.warn(`⚠️ Intento de acceso no autorizado detectado en la ruta: ${req.originalUrl}`);

        // Si la ruta empieza con '/api' (es decir, intentó usar un endpoint directamente)
        if (req.originalUrl.startsWith('/api')) {
            return res.status(403).json({ 
                success: false, 
                message: 'Acceso denegado. Se requieren privilegios de Administrador.' 
            });
        } else {

            return res.redirect('/?error=acceso_denegado'); 
        }
    }
}


module.exports = {
    saveUserSessionFunction,
    deleteUserSessionFunction,
    verifySessionFunction,
    verifyAdminFunction
}