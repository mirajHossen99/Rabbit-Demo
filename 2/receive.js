const amqp = require("amqplib");

async function receive() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "hello";

    await channel.assertQueue(queue, { durable: true });

    console.log(`[*] Waiting for messages in ${queue}`);

    channel.consume(
      queue,
      (msg) => {
        console.log(`[x] Received ${msg.content.toString()}`);
      },
      { noAck: true },
    );
  } catch (error) {
    console.log(error);
  }
}

receive();
