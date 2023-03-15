const express = require('express');

const app = express();


app.use(express.json());

app.use('/', (req, res, next) => {
    return res.status(200).json({'msg': 'Hello from customer'})
});


app.listen(8001, () => {
    console.log('Customer is listening to port 8001')
})