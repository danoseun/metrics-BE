import { celebrate, Joi, Segments } from "celebrate";
import joiDate from "@joi/date";

const extendedJoi = Joi.extend(joiDate);

export const createMetricSchema = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().trim().required().messages({
        "string.empty": `{{#label}} is not allowed to be empty`,
      }),
      value: Joi.number().min(1).required().messages({
        "number.minimum": `{{#label}} must be more than zero`,
      }),
    }),
  },
  { abortEarly: false }
);

export const searchMetricsSchema = celebrate(
  {
    [Segments.QUERY]: extendedJoi.object().keys({
      from: extendedJoi.date().format("YYYY-MM-DD").required(),
      to: extendedJoi.date().format("YYYY-MM-DD").required(),
    }),
  },
  { abortEarly: false }
);

export const filterMetricsSchema = celebrate(
  {
    [Segments.QUERY]: extendedJoi.object().keys({
      filter: Joi.string().trim().required().messages({
        "string.empty": `{{#label}} is not allowed to be empty`,
      }),
    }),
  },
  { abortEarly: false }
);

export const fetchGivenNumberOfRecordsSchema = celebrate(
  {
    [Segments.QUERY]: extendedJoi.object().keys({
      limit: Joi.number().min(1).required().messages({
        "number.minimum": `{{#label}} must be more than zero`,
      }),
    }),
  },
  { abortEarly: false }
);
