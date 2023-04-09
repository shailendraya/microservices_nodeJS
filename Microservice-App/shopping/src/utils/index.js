const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const amqplib = require("amqplib");

const {APP_SECRET, MESSAGE_BROKER_URL, EXCHANGE_NAME, QUEUE_NAME, SHOPPING_BINDING_KEY} = require('../config')


//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

// module.exports.PublishCustomerEvent = async (payload) => {
//   axios.post("http://customer:8001/customer/app-events/", {
//     payload,
//   });
// };

// module.exports.PublishShoppingEvent = async (payload) => {
//   axios.post(`http://shopping:8003/app-events/`, {
//     payload,
//   });
// };

module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    //console.log('Create Channel customer--->', channel)
    return channel;
  } catch (err) {
    console.log('Shopping create channel error-->', err)
    throw err;
  }
};

module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent from Shopping: ", msg);
};

module.exports.SubscribeMessage = async (channel, service) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue(QUEUE_NAME, { exclusive: true });
  console.log(` Waiting for messages in shopping queue: ${q.queue}`);

  channel.bindQueue(q.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);
  // const appQueue = await channel.assertQueue(QUEUE_NAME);

  // await channel.bindQueue(appQueue.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);

  // await channel.consume(appQueue.queue, data => {
  //   console.log('Received data in customer');
  //   console.log('data', data);
  //   console.log('data 2', data.content.toString());
  // })

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("Shopping channel data received");
    },
    {
      noAck: true,
    }
  );
};