require('dotenv/config')
const mongoose = require('mongoose')
const http = require('http')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { applyMiddleware } = require('graphql-middleware')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { gtl } = require('gtl-node')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('morgan')

    ; (async function () {

        const resolvers = require('./src/resolvers')
        const typeDefs = gtl({ directory: 'src/schema', pattern: '**/*', extension: 'graphql' })

        const app = express()
        const server = http.createServer(app)
        const apollo = new ApolloServer({
            schema: applyMiddleware(makeExecutableSchema({ typeDefs, resolvers })),
            formatError: ({ name, message, path }) => ({
                name,
                message: message.replace('Unexpected error value: ', ''),
                path
            })
        })

        mongoose.Promise = global.Promise
        mongoose
            .connect(process.env.MONGO_URI)
            .then(() => {
                if (process.env.NODE_ENV !== 'production') console.info('Database connected')
            })
            .catch((e) => {
                if (process.env.NODE_ENV !== 'production') console.error(`Database not connected: ${e.message}`)
            })

        app.use(bodyParser.json({ limit: '5mb' }))
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(helmet({ contentSecurityPolicy: false }))
        app.use(
            cors({
                allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
                exposedHeaders: ['Content-Type', 'Accept', 'Authorization'],
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
                credentials: true
            })
        )

        if (process.env.NODE_ENV !== 'production') {
            app.use(logger('dev'))
        }

        await apollo.start()
        apollo.applyMiddleware({ app })
        server.listen(process.env.PORT || 3000, () => console.log(`Apollo server running on ${server.address().port}`))
    })()
