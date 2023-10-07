import { Router } from 'express';

import { createMetricSchema, searchMetricsSchema, filterMetricsSchema, fetchGivenNumberOfRecordsSchema } from '../validations/metric';


import { metricController } from '../controller/metric';

export const router = Router();

// users
router.post('/metrics', createMetricSchema, metricController.addMetric);
router.get('/metrics', filterMetricsSchema, metricController.filterMetrics);
router.get('/search', searchMetricsSchema, metricController.searchMetrics);
router.get('/limit', fetchGivenNumberOfRecordsSchema, metricController.fetchGivenNumberOfRecords);

