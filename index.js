'use strict'

const fp = require('fastify-plugin')
const axios = require('axios')

async function fastifyAxios (fastify, opts) {
  const { clients = {}, ...defaultArgs } = opts
  let instance = null

  if (Object.keys(clients).length === 0) {
    instance = axios.create(defaultArgs)
  } else {
    instance = {}
    for (const name of Object.keys(clients)) {
      Object.defineProperty(instance, name, {
        value: axios.create(clients[name]),
        writable: false
      })
    }
  }

  fastify.decorate('axios', instance)
}

module.exports = fp(fastifyAxios, {
  fastify: '>= 2.0.0',
  name: 'fastify-axios'
})
