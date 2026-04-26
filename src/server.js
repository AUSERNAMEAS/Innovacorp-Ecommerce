const app = require('./app');
const PORT = 3000;
//routes

//route to get products
const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);

//route to handle custom requests

const customRequestRoutes = require('./routes/customRequest');
app.use('/api/custom-requests', customRequestRoutes);

// route to create users
const userRoutes = require('./routes/createNewUser');
app.use('/api/createUser', userRoutes);

//route to test sessions
const sessionTestRoutes = require('./routes/sessionTest');
app.use('/api/session', sessionTestRoutes);

//main page route
const mainPageRoutes = require('./routes/mainPage');
app.use('/api/main-page', mainPageRoutes);

// route to serach users
const searchUserRoutes = require('./routes/searchUser');
app.use('/api/search-user', searchUserRoutes);

// route to delete user session
const deleteUserSessionRoute = require('./routes/deleteUserSession');
app.use('/api/delete-user-session', deleteUserSessionRoute);

// route to create new order
const createNewOrderRoutes = require('./routes/createNewOrder');
app.use('/api/create-new-order', createNewOrderRoutes);

// route to user page
const userPageRoutes = require('./routes/userPage');
app.use('/api/user-page', userPageRoutes);

// route to get custom request image
const getImageCustomRoutes = require('./routes/getImageCustom');
app.use('/api/admin-panel/customImage', getImageCustomRoutes);

// route to admin panel
const adminPanelRoutes = require('./routes/adminPanel');
app.use('/api/admin-panel', adminPanelRoutes);

// route to handle google auth
const googleAuthRoutes = require('./routes/googleAut');
app.use('/auth/google', googleAuthRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

