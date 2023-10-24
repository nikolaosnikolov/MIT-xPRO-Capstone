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

    const { MongoClient, ObjectId } = mongodb
    const client = new MongoClient(databaseUrl, { monitorCommands: true })
    await client.connect()
    const db = client.db(databaseName)

    try {
        const promiseArray = request.body.items.map(async (item) => {
            const { _id, quantity } = item
            const dish = await db.collection("dishes").findOne({ _id: new ObjectId(_id) })
            const { price } = dish
            return dish
                ? {
                    ...dish,
                    quantity,
                    pay: price * quantity
                }
                : null

        })

        const result = await Promise.all(promiseArray)
        const items = result.filter(item => item !== null)
        const total = items.reduce((accumulator, item) => {
            accumulator = accumulator + item.pay
            return accumulator
        }, 0)

        const doc = {
            items: items,
            creationDate: new Date(),
            userID: verification._id,
            total: total,
            address: request.body.address,
            mobile: request.body.phone,
            city: request.body.city
        }

        await db.collection("orders").insertOne(doc)
            .then(result => {
                result.acknowledged === true
                    ? response.status(200).json({})
                    : response.status(500).json({ error: { code: '', message: 'Database error.' } })
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