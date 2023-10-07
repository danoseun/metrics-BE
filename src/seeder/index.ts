import { MetricModel } from '../models/metric.model';
import { connect, disconnect } from '../config';

export const seedMetrics = async () => {
  try {
    await MetricModel.insertMany(metrics);
    console.log('Metrics seeded 🚀');
  } catch (error) {
    console.log(error);
  }
};

const metrics = [
  {
    name: 'user metrics',
    value: 100,
    createdAt: '2023-03-10'
  },
  {
    name: 'log metrics',
    value: 225,
    createdAt: '2023-04-10'
  },
  {
    name: 'audit logs',
    value: 150,
    createdAt: '2023-05-10'
  },
  {
    name: 'grafana logs',
    value: 115,
    createdAt: '2023-03-12'
  },
  {
    name: 'transaction logs',
    value: 105,
    createdAt: '2023-03-11'
  },
  {
    name: 'dispute logs',
    value: 191,
    createdAt: '2023-10-06'
  },
  {
    name: 'card logs',
    value: 175,
    createdAt: '2023-10-04'
  },
  {
    name: 'kyc logs',
    value: 142,
    createdAt: '2023-10-02'
  }
];



// (async () => {
//   await connect();
//   await seedMetrics();
//   disconnect();
// })();