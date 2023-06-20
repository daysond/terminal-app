import * as amqp from 'amqp-connection-manager';
import { createFiles } from '../app.js'
import { execSync } from "child_process";

const QUEUE_NAME = 'judge'
const connection = amqp.connect(['amqp://rabbitmq:5672']);

connection.on('connect', function () {
    // Install pip
    //TODO: LASTEST URLhttps://bootstrap.pypa.io/get-pip.py
    // Modify docker file to include python latest in the container, and install pip as well,
    execSync('curl https://bootstrap.pypa.io/pip/3.5/get-pip.py -o get-pip.py');
    execSync('python3 get-pip.py');

    // Install pipreqs
    execSync('pip install pipreqs');
    console.log('Connected!');
});

connection.on('disconnect', function (err) {
    console.log('Disconnected.', err);
});

const onMessage = (data) => {

    let message = JSON.parse(data.content.toString());
    //console.log(message);
    createFiles(message, channelWrapper, data);
}

// Set up a channel listening for messages in the queue.
const channelWrapper = connection.createChannel({
    setup: function (channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        return Promise.all([
            channel.assertQueue(QUEUE_NAME, { durable: true }),
            channel.prefetch(1),
            channel.consume(QUEUE_NAME, onMessage)
        ]);
    }
});

channelWrapper.waitForConnect()
    .then(function () {
        console.log("Listening for messages");
    });