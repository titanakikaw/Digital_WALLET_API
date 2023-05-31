const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config();
const app = express();
const cors = require('cors')

const port =  process.env.SERVER_PORT;

const AuthRouter = require('./routes/AuthRoute');
const UserRoutes = require('./routes/UserRoute');
const TransRoute = require('./routes/TransRoute');

app.use(bodyParser.json())
app.use(cors())
app.use('/auth', AuthRouter)
app.use('/users',UserRoutes)
app.use('/api/transaction',TransRoute)


// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});