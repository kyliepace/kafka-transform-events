import KafkaConsumer from './KafkaConsumer';
import EventModel from './models/EventModel';
import * as constants from '../constants.json';
import TransformService from './services/TransformService';


async function run() {
  const transformService = new TransformService(EventModel);
  const consumer = new KafkaConsumer(constants.topics.EVENTS, 'test-group', transformService.processMessage);


  // subscribe to topic and call event.processMessage on each received message
  await consumer.subscribe();
  await consumer.onEvent();

  // make sure connections close on program exit
  process.on('SIGINT', function() {
    console.log('\n gracefully exiting')
    consumer.close();
    process.exit();
  });
}

run().catch(err => {
  console.log(err)
});