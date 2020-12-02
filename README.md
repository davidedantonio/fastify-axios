# fastify-axios

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/) [![codecov](https://codecov.io/gh/davidedantonio/fastify-axios/branch/master/graph/badge.svg)](https://codecov.io/gh/davidedantonio/fastify-axios)


A plugin for Fastify that adds support for sending requests via [`axios`](https://github.com/axios/axios), a promise based HTTP(s) client for node.js and browser.

Under the hood `axios` http client is used, the options passed to register will be used as the default arguments while creating the axios http client.

## Install

```
npm install fastify-axios
```

## Default usage

Just add it to the project generated via [`fastify-cli`](https://github.com/fastify/fastify-cli), [`create-fastify-app`](https://github.com/davidedantonio/create-fastify-app), or  with `register` in you application as below.

You can access the `axios` instance via fastify.axios, which can be used to send HTTP(s) requests via methods `GET`, `POST`, `PUT`, `DELETE` etc. Here a simple example

```javascript
'use strict'

module.exports = async function (fastify, opts) {
  fastify.register(require('fastify-axios'))

  // request via axios.get
  const { data, status } = await fastify.axios.get('https://nodejs.org/en/')
  console.log('body size: %d', data.length)
  console.log('status: %d', status)
}
```

Alternatively you can specify default args to your axios instance. You can take a look at the default parameters here [https://github.com/axios/axios](https://github.com/axios/axios#request-config):


```javascript
'use strict'

module.exports = async function (fastify, opts) {
  fastify.register(require('fastify-axios'), {
    baseURL: 'https://nodejs.org'
  })

  // request via axios.get to https://nodejs.org/en/
  const { data, status } = await fastify.axios.get('/en/')
  console.log('body size: %d', data.length)
  console.log('status: %d', status)
}
```

## Add more clients

It's possibile to add more than one `axios` client to your fastify instance. Here's how:

```javascript
'use strict'

module.exports = async function (fastify, opts) {
  fastify.register(require('fastify-axios'), {
    clients: {
      v1: {
        baseURL: 'https://v1.api.com',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJxyz'
        }
      },
      v2: {
        baseURL: 'https://v2.api.com',
        headers: {
          'Authorization': 'Bearer UtOkO3UI9lPY1h3h9ygTn8pD0Va2pFDcWCNbSKlf2HE'
        }
      }
    }
  })

  // Now you can use the apis in the following way
  const { dataV1, statusV1 } = await fastify.axios.v1.get('/ping')
  const { dataV2, statusV2 } = await fastify.axios.v2.get('/ping')

  // do something with dataV1 and dataV2
}
```

## License

Licensed under [MIT](./LICENSE)