import * as mongodb from 'mongodb'
import Settings from '../../settings.js'
import Token from '../../tools/jwt.js'

const handler = async (request, response) => {
    if (request.method !== "POST") {
        response.status(415).json({ error: { code: '', message: 'Bad request method.' } })
        return
    }

    if (!request.headers.authorization) {
        response.status(403).json({ error: { code: '', message: 'Authorization required.' } })
        return
    }

    const splitter = request.headers.authorization.split(' ')
    if (splitter[0] !== 'Bearer') {
        response.status(403).json({ error: { code: '', message: 'Bad authorization type.' } })
        return
    }

    const token = new Token()
    const verification = token.verify({
        token: splitter[1],
        secret: Settings.security.jwt.secret,
        options: {
            audience: 'https://nikolaos-nikolovrestaurantapplication.mymit.eu',
            issuer: 'nikos.nikolov@mtel.gr',
        }
    })

    if (!verification) {
        response.status(403).json({ error: { code: '', message: 'Unauthorized user.' } })
        return
    }

    const databaseUrl = Settings.db.url
    const databaseName = Settings.db.name

    const { MongoClient } = mongodb
    const client = new MongoClient(databaseUrl, { monitorCommands: true })
    await client.connect()
    const db = client.db(databaseName)

    try {
        const result = await db.collection("restaurants").find({}).toArray()
        response.status(200).json({
            data: result
        })
    }
    catch (error) {
        throw error
    }
    finally {
        await client.close()
    }
}

export default handler