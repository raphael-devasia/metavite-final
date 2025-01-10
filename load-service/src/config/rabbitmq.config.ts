const amqp = require("amqplib")

export const connectRabbitMQ = async () => {
   const rabbitmqHost = process.env.RABBITMQ_HOST || "rabbitmq"
   const rabbitmqPort = process.env.RABBITMQ_PORT || "5672"

   const connection = await amqp.connect(
       `amqp://${rabbitmqHost}:${rabbitmqPort}`
   )
    const channel = await connection.createChannel()
    return { connection, channel }
}
