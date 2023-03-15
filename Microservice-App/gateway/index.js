const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy')
const app = express();

app.use(cors());
app.use(express.json());

// app.use('/', (req, res, next) => {
//     return res.status(200).json({'msg': 'Hello from gateway....'})
// });

app.use('/customer', proxy('http://localhost:8001'))
app.use('/shopping', proxy('http://localhost:8003'))
app.use('/', proxy('http://localhost:8002'))


app.listen(8000, () => {
    console.log('Customer is listening to port 8000')
})