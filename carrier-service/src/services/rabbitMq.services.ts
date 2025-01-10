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
export const publishToQueue = async (queue: string, message: any) => {
    const { connection, channel } = await connectRabbitMQ()
    await channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true })
    console.log("Message sent to queue:", message)
    await channel.close()
    await connection.close()
}
