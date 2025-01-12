const amqp = require("amqplib")

import paymentRepository from "../repositories/payment.repository"

// Consume notification queue and send emails
const consumeNotificationQueue = async () => {
    const rabbitmqHost = process.env.RABBITMQ_HOST || "rabbitmq"
    const rabbitmqPort = process.env.RABBITMQ_PORT || "5672"

    const connection = await amqp.connect(
        `amqp://${rabbitmqHost}:${rabbitmqPort}`
    )
    const channel = await connection.createChannel()
    const queue = "paymentUpdateQueue"

    // Assert the queue exists and is durable
    await channel.assertQueue(queue, { durable: true })
    console.log("Waiting for messages in queue:", queue)

    // Handle incoming messages
    channel.consume(queue, async (msg: any) => {
        if (msg !== null) {
            try {
                const message = JSON.parse(msg.content.toString()) // Properly parse the JSON
                console.log("Message received:", message)
                if (message.action === "Refund") {
                     try {
                         await paymentRepository.initiateRefund(message.loadId)
                     } catch (refundError) {
                         console.error(
                             "Error refunding payment for loadId:",
                             message.loadId,
                             refundError
                         )
                         // Optionally, send the message to a Dead Letter Queue (DLQ)
                         channel.nack(msg, false, false) // Don't requeue, send to DLQ
                         return
                     }
                } else if (message.action === "Release") {
                   try {
                       await paymentRepository.releasePayment(message.loadId)
                   } catch (releaseError) {
                       console.error(
                           "Error releasing payment for loadId:",
                           message.loadId,
                           releaseError
                       )
                       // Optionally, send the message to a Dead Letter Queue (DLQ)
                       channel.nack(msg, false, false) // Don't requeue, send to DLQ
                       return
                   }
                }
                // Call the updateUser function to update the user's status
            } catch (error) {
                console.error("Error processing message:", error)

                // Negative acknowledge the message to be requeued in case of error
                channel.nack(msg, false, true)
            }
        }
    })

    // Graceful shutdown handler
    const gracefulShutdown = () => {
        console.log("Closing RabbitMQ connection gracefully...")
        channel.close()
        connection.close()
        process.exit(0)
    }

    // Listen for termination signals to shut down gracefully
    process.on("SIGINT", gracefulShutdown)
    process.on("SIGTERM", gracefulShutdown)
}

// Start consuming the queue
consumeNotificationQueue().catch((error) => {
    console.error("Error in consuming notifications:", error)
    process.exit(1)
})
