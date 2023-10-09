import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";
import { Metric, MetricModel } from "../models";
import BaseService from "../services/metric";
import { respond } from "../utilities";
import { ConflictError } from "../errors/ConflictError";

const metricService = new BaseService(MetricModel);

export const metricController = {
  async addMetric(req: Request, res: Response, next: NextFunction) {
    try {
      const existingMetricName = await metricService.show(
        "name",
        req.body.name
      );

      if (existingMetricName) {
        throw new ConflictError("metric name already exists");
      }
      const metric = await metricService.create(req.body);
      return respond<Metric>(res, metric, HttpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async filterMetrics(req: Request, res: Response, next: NextFunction) {
    let { page, perPage } = req.query as Record<string, string>;
    const limit = parseInt(perPage as string, 10) || 10;
    const offset = parseInt(page as string, 10) || 1;

    try {
      //1 minute
      if (req.query.filter === "1m") {
        // Calculate the date one minute ago
        const oneMinuteAgo = new Date();
        oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
        const recordsWithinTheMinute = await metricService.index(
          {
            createdAt: {
              $gte: oneMinuteAgo,
            },
          },
          offset,
          limit
        );
        return respond<Metric[]>(res, recordsWithinTheMinute, HttpStatus.OK);
      }

      //1 day
      if (req.query.filter === "1d") {
        // Calculate the date one day ago
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const recordsWithinTheDay = await metricService.index(
          {
            createdAt: {
              $gte: twentyFourHoursAgo,
            },
          },
          offset,
          limit
        );
        return respond<Metric[]>(res, recordsWithinTheDay, HttpStatus.OK);
      }

      //7 days
      if (req.query.filter === "7d") {
        // Calculate the date seven days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Find documents created in the last 7 days
        const recordsWithinTheLastSevenDays = await metricService.index(
          {
            createdAt: {
              $gte: sevenDaysAgo,
            },
          },
          offset,
          limit
        );
        return respond<Metric[]>(
          res,
          recordsWithinTheLastSevenDays,
          HttpStatus.OK
        );
      }

      // 30 days
      if (req.query.filter === "30d") {
        // Calculate the date seven days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find documents created in the last 7 days
        const recordsWithinTheLastThirtyDays = await metricService.index(
          {
            createdAt: {
              $gte: thirtyDaysAgo,
            },
          },
          offset,
          limit
        );
        return respond<Metric[]>(
          res,
          recordsWithinTheLastThirtyDays,
          HttpStatus.OK
        );
      }
      
      if (req.query.filter === "1h") {
        // defaults to calculate record within the hour
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        const recordsWithinTheHour = await metricService.index(
          {
            createdAt: {
              $gte: oneHourAgo,
            },
          },
          offset,
          limit
        );
        return respond<Metric[]>(res, recordsWithinTheHour, HttpStatus.OK);
      }
      
      else {
        return respond(res, 'no data found for search term', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      next(error);
    }
  },

  async searchMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      //search date range
      let { page, perPage } = req.query as Record<string, string>;
      const limit = parseInt(perPage as string, 10) || 10;
      const offset = parseInt(page as string, 10) || 1;

      const dateRangeSearchResult = await metricService.index(
        {
          createdAt: {
            $gte: req.query.from,
            $lte: req.query.to,
          },
        },
        offset,
        limit
      );
      return respond<Metric[]>(res, dateRangeSearchResult, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  },

  async fetchGivenNumberOfRecords(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const limit = Number(req.query.limit);
      //fetch given number of records
      const records = await metricService.index({}, 1, limit);

      return respond<Metric[]>(res, records, HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  },
};
