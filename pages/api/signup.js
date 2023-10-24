import * as mongodb from 'mongodb'
import Settings from '../../settings.js'
import Token from '../../tools/jwt.js'

const handler = async (request, response) => {
    if (request.method !== "POST") {
        response.status(415).json({ error: { code: '', message: 'Bad request method.' } })
        return
    }

    if (!request.body || !request.body.username || !request.body.password) {
        response.status(405).json({ error: { code: '', message: 'Bad request body.' } })
        return
    }

    const databaseUrl = Settings.db.url
    const databaseName = Settings.db.name

    const { MongoClient } = mongodb
    const client = new MongoClient(databaseUrl, { monitorCommands: true })
    await client.connect()
    const db = client.db(databaseName)

    const filter = {
        username: request.body.username,
        password: request.body.password
    }

    const options = {
        projection: { password: 0 }
    }

    try {
        await db.collection("users").insertOne(filter)
        await db.collection("users").findOne(filter, options)
            .then((user) => {
                !user
                    ? (response.end(JSON.stringify({ message: 'no user' })))
                    : (async () => {
                        const { username, _id } = user
                        const token = new Token()
                        const payload = { username, _id }
                        const secret = Settings.security.jwt.secret
                        const options = {
                            subject: String(user._id),
                            audience: 'https://nikolaos-nikolovrestaurantapplication.mymit.eu',
                            issuer: 'nikos.nikolov@mtel.gr',
                        }
                        const jwt = await token.create(payload, secret, options)
                        const body = {
                            access: user ? true : false,
                            token: jwt
                        }

                        response.status(200).json(body)
                    })()
            })
    } catch (error) {
        throw error
    } finally {
        await client.close()
    }
}

export default handler