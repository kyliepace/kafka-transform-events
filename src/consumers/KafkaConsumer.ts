import { Consumer, EachMessagePayload } from 'kafkajs';
import kafkaClient from '../KafkaClient';


type EventHandler = (payload: EachMessagePayload) => Promise<void>

export default class KafkaConsumerModel {
  topicName: string;
  groupId: string;
  private consumer: Consumer;

  constructor(topicName: string, groupId: string){
    this.topicName = topicName;
    this.groupId = groupId;
    this.consumer = kafkaClient.consumer({
      groupId
    });
  }

  async connect(): Promise<void>{
    await this.consumer.connect();
  }

  async onEvent(callback: EventHandler): Promise<void> {
    await this.consumer.subscribe({
      topic: this.topicName,
      fromBeginning: true
    });

    return await this.consumer.run({
      eachMessage: callback
    });
  }
}