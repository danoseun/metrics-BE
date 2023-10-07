import { model } from 'mongoose';

import { Metric } from './metric.type';
import { MetricSchema } from './metric.schema';

export const MetricModel = model<Metric>('metric', MetricSchema);