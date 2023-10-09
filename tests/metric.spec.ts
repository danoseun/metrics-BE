import supertest from "supertest";
import app from "../src/app";
import HttpStatus from "http-status-codes";

const request = supertest(app);

describe("METRIC SERVICE", () => {
  it("Server is up and running", async () => {
    const res = await request.get("/v1/health");
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.message).toEqual("server is up and running");
  });

  it("Error for wrong route", async () => {
    const res = await request.get("/abc");
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
    expect(res.body.message).toEqual("resource not found");
  });

  it("Should not create a metric without name and value", async () => {
    const res = await request.post("/v1/metrics").send({ name: "", value: "" });
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("Validation Error");
    expect(res.body.data.name.message).toContain("name");
    expect(res.body.data.value.message).toContain("value");
  });

  it("Should not create a metric when value is 0 or less", async () => {
    const res = await request
      .post("/v1/metrics")
      .send({ name: "test metric", value: -1 });
    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("Validation Error");
    expect(res.body.data.value).toEqual({
      message: "value must be greater than or equal to 1",
    });
  });

  it("Should create a metric when value is greater than 0", async () => {
    const res = await request
      .post("/v1/metrics")
      .send({ name: "posted test metric", value: 10 });
    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.name).toEqual("posted test metric");
    expect(res.body.data.value).toEqual(10);
  });

  it("Should not create a metric when name already exists", async () => {
    const res = await request
      .post("/v1/metrics")
      .send({ name: "posted test metric", value: 15 });
    expect(res.status).toBe(HttpStatus.CONFLICT);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("metric name already exists");
  });

  it("Should create another metric", async () => {
    const res = await request
      .post("/v1/metrics")
      .send({ name: "another metric", value: 20 });

    expect(res.status).toBe(HttpStatus.CREATED);
    expect(res.body.status).toEqual("success");
    expect(res.body.data.name).toEqual("another metric");
    expect(res.body.data.value).toEqual(20);
  });

  it("Should filter metrics based on value passed", async () => {
    const res = await request.get(`/v1/metrics?filter=7d`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.status).toEqual("success");
    expect(res.body).toHaveProperty("data");
  });

  it("Should not filter metrics if filter value passed is wrong", async () => {
    const res = await request.get(`/v1/metrics?filter=2d`);
    expect(res.status).toBe(HttpStatus.NOT_FOUND);
    expect(res.body.status).toEqual("error");
    expect(res.body.message).toEqual("no data found for search term");
  });

  it("Should search and return metrics based on date", async () => {
    const res = await request.get(`/v1/search?from=2023-03-12&to=2023-10-06`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.status).toEqual("success");
    expect(res.body).toHaveProperty("data");
  });

  it("Should return number of metrics passed", async () => {
    const res = await request.get(`/v1/limit?limit=10`);
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body.status).toEqual("success");
    expect(res.body).toHaveProperty("data");
  });
});
