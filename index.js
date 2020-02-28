'use strict'

const fp = require('fastify-plugin')
const axios = require('axios')

async function fastifyAxios (fastify, opts) {
  const { clients = {}, ...defaultArgs } = opts
  let interceptors = null

  if (defaultArgs.interceptors) {
    interceptors = defaultArgs.interceptors
    delete defaultArgs.interceptors
  }

  const instance = axios.create(defaultArgs)

  if (interceptors) {
    if (interceptors.request && interceptors.errorRequest) {
      instance.interceptors.request.use(interceptors.request, interceptors.errorRequest)
    }

    if (interceptors.response && interceptors.errorResponse) {
      instance.interceptors.response.use(interceptors.response, interceptors.errorResponse)
    }
  }

  if (Object.keys(clients).length !== 0) {
    for (const name of Object.keys(clients)) {
      const axiosInstance = axios.create(clients[name])

      if (clients[name].interceptors) {
        if (clients[name].interceptors.request && clients[name].interceptors.errorRequest) {
          axiosInstance.interceptors.request.use(clients[name].interceptors.request, clients[name].interceptors.errorRequest)
        }

        if (clients[name].interceptors.response && clients[name].interceptors.errorResponse) {
          axiosInstance.interceptors.response.use(clients[name].interceptors.response, clients[name].interceptors.errorResponse)
        }
      }

      Object.assign(instance, {
        [name]: axiosInstance
      })
    }
  }

  fastify.decorate('axios', instance)
}

module.exports = fp(fastifyAxios, {
  fastify: '>= 2.0.0',
  name: 'fastify-axios'
})
