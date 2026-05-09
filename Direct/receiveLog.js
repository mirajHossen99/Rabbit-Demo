const amqp = require("amqplib");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

const receiveLog = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchange = "direct_logs";

  channel.assertExchange(exchange, "direct", { durable: false });
  const q = await channel.assertQueue("", { exclusive: true });

  console.log("[*] Waiting for logs. To exit press CTRL+C");
  args.forEach((severity) => {
    channel.bindQueue(q.queue, exchange, severity);
  });

  channel.consume(
    q.queue,
    (msg) => {
      console.log(
        "[x] %s: '%s'",
        msg.fields.routingKey,
        msg.content.toString(),
      );
    },
    { noAck: true },
  );
};

receiveLog();