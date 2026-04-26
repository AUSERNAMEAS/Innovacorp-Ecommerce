const {deleteUserSessionFunction}= require('../utils/functions/userSessionFunctions');
// we import the util to delete the user session
// i dont think ts is neccesary
function deleteUserSession(req)
{
    deleteUserSessionFunction(req);
}

module.exports = { deleteUserSession }; 