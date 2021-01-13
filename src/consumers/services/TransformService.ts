import { EachMessagePayload } from "kafkajs";
import { safeParseJSON } from "../helpers";
import IEvent from "../interfaces/IEvent";
import IRepositoryLayer from "../interfaces/IRepositoryLayer";
import EventModel from "../models/EventModel";
import RedisRepository from "../repositories/RedisRepository";


export default class TransformService {
  Model;
  database: IRepositoryLayer;

  constructor(Model = EventModel, DatabaseRepository = RedisRepository){
    this.Model = Model;
    this.database = new DatabaseRepository();
  }

  async processMessage({ partition, message }: EachMessagePayload ): Promise<void> {
    const data: IEvent | null = safeParseJSON<IEvent>(message?.value);
    if (!data){
      return;
    }

    const dataModel = new this.Model(data);

    await this.database.save(dataModel.session_id, dataModel);
  }
}