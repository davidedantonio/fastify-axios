'use strict'

const t = require('tap')
const { test } = t
const Fastify = require('fastify')

const axiosPlugin = require('./index')

test('fastify.axios intance and instance.methods exists', t => {
  t.plan(12)
  const fastify = Fastify()
  fastify.register(axiosPlugin, {})

  fastify.ready(err => {
    t.error(err)
    t.ok(fastify.axios)
    t.ok(fastify.axios.post)
    t.ok(fastify.axios.get)
    t.ok(fastify.axios.patch)
    t.ok(fastify.axios.options)
    t.ok(fastify.axios.put)
    t.ok(fastify.axios.getUri)
    t.ok(fastify.axios.delete)
    t.ok(fastify.axios.head)
    t.ok(fastify.axios.request)
    t.equal(fastify.axios.defaults.defaultArgs, undefined)

    fastify.close()
  })
})

test('fastify.axios should be an axios instance', t => {
  t.plan(2)
  const fastify = Fastify()
  fastify.register(axiosPlugin)

  fastify.ready(err => {
    t.error(err)
    t.ok(fastify.axios instanceof Function)

    fastify.close()
  })
})

test('verify default args', t => {
  t.plan(4)
  const fastify = Fastify()
  fastify.register(axiosPlugin, {
    baseURL: 'https://nodejs.org',
    interceptors: {
      request: function (config) {
        console.log(config)
      },
      errorRequest: function (error) {
        console.log(error)
      },
      response: function (config) {
        console.log(config)
      },
      errorResponse: function (error) {
        console.log(error)
      }
    }
  })

  fastify.ready(async err => {
    t.error(err)
    t.equal(fastify.axios.defaults.baseURL, 'https://nodejs.org')
    t.equal(typeof fastify.axios.interceptors.request, 'object')
    t.equal(typeof fastify.axios.interceptors.response, 'object')

    fastify.close()
  })
})

test('fastify.axios works well', t => {
  t.plan(3)
  const fastify = Fastify()
  fastify.register(axiosPlugin)

  fastify.ready(async err => {
    t.error(err)

    const { data, status } = await fastify.axios.get('https://nodejs.org/en/')
    t.ok(data)
    t.equal(status, 200)

    fastify.close()
  })
})

test('fastify.axios register multiple clients', t => {
  t.plan(26)
  const fastify = Fastify()

  fastify.register(axiosPlugin, {
    clients: {
      nodejs: {
        baseURL: 'https://nodejs.org'
      },
      google: {
        baseURL: 'https://google.com',
        interceptors: {
          request: function (config) {
            console.log(config)
          },
          errorRequest: function (error) {
            console.log(error)
          },
          response: function (config) {
            console.log(config)
          },
          errorResponse: function (error) {
            console.log(error)
          }
        }
      }
    }
  })

  fastify.ready(async err => {
    t.error(err)
    t.ok(fastify.axios.nodejs)
    t.ok(fastify.axios.nodejs instanceof Function)
    t.ok(fastify.axios.nodejs.post)
    t.ok(fastify.axios.nodejs.get)
    t.ok(fastify.axios.nodejs.patch)
    t.ok(fastify.axios.nodejs.options)
    t.ok(fastify.axios.nodejs.put)
    t.ok(fastify.axios.nodejs.getUri)
    t.ok(fastify.axios.nodejs.delete)
    t.ok(fastify.axios.nodejs.head)
    t.ok(fastify.axios.nodejs.request)
    t.equal(fastify.axios.nodejs.defaults.baseURL, 'https://nodejs.org')

    t.ok(fastify.axios.google)
    t.ok(fastify.axios instanceof Object)
    t.ok(fastify.axios.google instanceof Function)
    t.ok(fastify.axios.google.post)
    t.ok(fastify.axios.google.get)
    t.ok(fastify.axios.google.patch)
    t.ok(fastify.axios.google.options)
    t.ok(fastify.axios.google.put)
    t.ok(fastify.axios.google.getUri)
    t.ok(fastify.axios.google.delete)
    t.ok(fastify.axios.google.head)
    t.ok(fastify.axios.google.request)
    t.equal(fastify.axios.google.defaults.baseURL, 'https://google.com')

    fastify.close()
  })
})
