
function verifyUserSession(req,res,next)
{
    //verify if the user session exists
    if (req.session.user) 
    { // if session exists we gonna send back the user data
    console.log('User session data:', req.session.user);
      // we gonna save 2 varuables logged and user
    res.json({
      logged: true,
      user: req.session.user
    });
    
    } 
    else 
    {
    res.json({ logged: false });
    }
}


module.exports = { verifyUserSession};