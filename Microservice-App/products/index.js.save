const express = require('express');

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {
    console.log('Product service invoked')
    return res.status(200).json({'msg': 'Hello from products'})
});


app.listen(8002, () => {
    console.log('Product is listening to port 8002')
})