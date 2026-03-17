import { test } from "tap";
import Fastify from "fastify";
import axiosPlugin from "../src/index.js";

test("fastify.axios instance and instance.methods exists", async (t) => {
  t.plan(12);
  const fastify = Fastify();
  fastify.register(axiosPlugin, {});

  await fastify.ready();
  t.ok(fastify.axios);
  t.ok(fastify.axios.post);
  t.ok(fastify.axios.get);
  t.ok(fastify.axios.patch);
  t.ok(fastify.axios.options);
  t.ok(fastify.axios.put);
  t.ok(fastify.axios.getUri);
  t.ok(fastify.axios.delete);
  t.ok(fastify.axios.head);
  t.ok(fastify.axios.request);
  t.equal(fastify.axios.defaults.baseURL, undefined);
  t.notOk((fastify.axios.defaults as any).defaultArgs);

  await fastify.close();
});

test("fastify.axios should be an axios instance", async (t) => {
  t.plan(1);
  const fastify = Fastify();
  fastify.register(axiosPlugin);

  await fastify.ready();
  t.ok(fastify.axios instanceof Function);

  await fastify.close();
});

test("verify default args", async (t) => {
  t.plan(3);
  const fastify = Fastify();
  fastify.register(axiosPlugin, {
    baseURL: "https://nodejs.org",
    interceptors: {
      request: (config) => config,
      errorRequest: (error) => Promise.reject(error),
      response: (res) => res,
      errorResponse: (error) => Promise.reject(error),
    },
  });

  await fastify.ready();
  t.equal(fastify.axios.defaults.baseURL, "https://nodejs.org");
  t.equal(typeof fastify.axios.interceptors.request, "object");
  t.equal(typeof fastify.axios.interceptors.response, "object");

  await fastify.close();
});

test("fastify.axios register multiple clients", async (t) => {
  t.plan(25);
  const fastify = Fastify();

  fastify.register(axiosPlugin, {
    clients: {
      nodejs: {
        baseURL: "https://nodejs.org",
      },
      google: {
        baseURL: "https://google.com",
        interceptors: {
          request: (config) => config,
          errorRequest: (error) => Promise.reject(error),
          response: (res) => res,
          errorResponse: (error) => Promise.reject(error),
        },
      },
    },
  });

  await fastify.ready();
  t.ok(fastify.axios.nodejs);
  t.ok(fastify.axios.nodejs instanceof Function);
  t.ok(fastify.axios.nodejs.post);
  t.ok(fastify.axios.nodejs.get);
  t.ok(fastify.axios.nodejs.patch);
  t.ok(fastify.axios.nodejs.options);
  t.ok(fastify.axios.nodejs.put);
  t.ok(fastify.axios.nodejs.getUri);
  t.ok(fastify.axios.nodejs.delete);
  t.ok(fastify.axios.nodejs.head);
  t.ok(fastify.axios.nodejs.request);
  t.equal(fastify.axios.nodejs.defaults.baseURL, "https://nodejs.org");

  t.ok(fastify.axios.google);
  t.ok(fastify.axios instanceof Object);
  t.ok(fastify.axios.google instanceof Function);
  t.ok(fastify.axios.google.post);
  t.ok(fastify.axios.google.get);
  t.ok(fastify.axios.google.patch);
  t.ok(fastify.axios.google.options);
  t.ok(fastify.axios.google.put);
  t.ok(fastify.axios.google.getUri);
  t.ok(fastify.axios.google.delete);
  t.ok(fastify.axios.google.head);
  t.ok(fastify.axios.google.request);
  t.equal(fastify.axios.google.defaults.baseURL, "https://google.com");
  await fastify.close();
});
