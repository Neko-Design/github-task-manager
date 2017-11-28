// Required Modules
const express = require('express');
const expressNunjucks = require('express-nunjucks');
const Consumer = require('sqs-consumer');
import {EventHandler} from '../lib/EventHandler';
import {Utils} from '../lib/utils';
require('dotenv').config();

// Init Event Handler
let sampleEventHandler = new EventHandler('pull_request', function(eventData) {
    console.log('Processed Event ' + eventData.testVal);
});

// Setting up Instances
const app = express();
const isDev = process.env.ENVIRONMENT === 'development';
const pendingQueueHandler = Consumer.create({
    queueUrl: process.env.SQS_PENDING_QUEUE,
    region: 'ap-southeast-2',
    handleMessage: (message, done) => {
        sampleEventHandler.handleEvent(message);
        done();
    }
});

const bannerData = [
    ' #####  #     # #######                            ',
    '#     # #     # #       #    # ###### #    # ##### ',
    '#       #     # #       #    # #      ##   #   #   ',
    '#  #### ####### #####   #    # #####  # #  #   #   ',
    '#     # #     # #       #    # #      #  # #   #   ',
    '#     # #     # #        #  #  #      #   ##   #   ',
    ' #####  #     # #######   ##   ###### #    #   #   ',
    '###################################################'
];

// Configure Templates
app.set('views', __dirname + '/templates');

// Init Nunjucks
const njk = expressNunjucks(app, {
    watch: isDev,
    noCache: isDev
});

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/event_test/', (req, res) => {
    var event = {
        testVal: 'something',
        eventType: 'pull_request'
    };
    sampleEventHandler.handleEvent(event);
    res.render('index.html');
});

pendingQueueHandler.on('error', (err) => {
    console.log("ERROR In SQS Queue Handler")
    console.log(err.message);
});

pendingQueueHandler.start();

app.listen(process.env.PORT, function() {
    bannerData.forEach(function(line) {
        console.log(line);
    });
    console.log('GitHub Event Orchestrator Running on Port ' + process.env.PORT);
    console.log('Runmode: ' + process.env.ENVIRONMENT);
    console.log('AWS Access Key ID: ' + Utils.maskString(process.env.AWS_ACCESS_KEY_ID));
    console.log('AWS Access Key: ' + Utils.maskString(process.env.AWS_SECRET_ACCESS_KEY));
    console.debug(njk.env);
});