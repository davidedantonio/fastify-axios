'use strict'

const fp = require('fastify-plugin')
const axios = require('axios')

async function fastifyAxios (fastify, opts) {
  const { clients = {}, ...defaultArgs } = opts
  const instance = axios.create(defaultArgs)

  if (Object.keys(clients).length !== 0) {
    for (const name of Object.keys(clients)) {
      Object.assign(instance, {
        [name]: axios.create(clients[name])
      })
    }
  }

  fastify.decorate('axios', instance)
}

module.exports = fp(fastifyAxios, {
  fastify: '>= 2.0.0',
  name: 'fastify-axios'
})
