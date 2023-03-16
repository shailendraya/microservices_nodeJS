const CustomerService = require("../services/customer-service");

module.exports = (app) => {
    try{
        console.log('customer---->')
    const service = new CustomerService();
    app.use('/app-events',async (req,res,next) => {

        const { payload } = req.body;

        //handle subscribe events
        service.SubscribeEvents(payload);

        console.log("============= Customer service invoked ================");
        console.log(payload);
        res.json(payload);

    });
} catch (err){
    console.log('customer appEvent error-->', err)
    throw(err)
}

}
