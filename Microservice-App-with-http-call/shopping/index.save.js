const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {
    return res.status(200).json({'msg': 'Hello from shopping'})
});


app.listen(8003, () => {
    console.log('Shopping is listening to port 8003')
})