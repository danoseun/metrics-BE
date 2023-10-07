import { Metric } from '../models/metric.type';
import { Model } from 'mongoose';

class MetricService {
    model: typeof Model
    constructor(model: Model<any, {}, {}, {}, any, any>) {
      this.model = model
    }
  
    create(resource: Metric) {
      return this.model.create(resource)
    }
  
    index(options = {}, page: number, perPage: number) {
      return this.model.find(options).skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 }).exec();
    }

    find(options = {}){
        return this.model.find(options).exec();
    }
  
    show(field: string, value: any) {
      return this.model.findOne({ [field]: value }).exec();
    }
  }
  
  export default MetricService;