const amqp = require("amqplib");

async function send() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "hello";
    const msg = "Hello World";

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg));

    console.log(`[x] Sent ${msg}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

send();
