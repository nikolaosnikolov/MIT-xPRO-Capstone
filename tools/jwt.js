import * as uuid from 'uuid'
import jwt from 'jsonwebtoken'

class Token {

    constructor() {

    }

    get verify() {
        return this.#verify
    }
    get create() {
        return (payload, secret, options) => new Promise(async (resolve, reject) => {

            const token = payload && this.#create(payload, secret, options)

            token
                ? resolve(token)
                : reject({ message: 'Token not created' })
        })
    }

    #verify = (object) => {
        const { token, secret, options } = object

        try {
            const verified = jwt.verify(
                token,
                Buffer.from(secret, 'base64'),
                options
            )
            const answer = verified.exp * 1000 > (new Date).getTime()
                ? { ...verified }
                : null
            return answer
        } catch (error) {
            console.log(error)
            return null
        }

    }

    #create = (payload, secret, options) => {

        const {
            jwtid = uuid.v4(),
            audience = 'https://classofthings.com',
            issuer = 'https://classofthings.com',
            expiresIn = '15h',
            mutatePayload = false,
            algorithm = 'HS256',
            subject = '',
        } = options

        const token = jwt.sign(
            payload,
            Buffer.from(secret, 'base64'),
            {
                jwtid,
                audience,
                issuer,
                expiresIn,
                mutatePayload,
                algorithm,
                subject,
            })

        return token

    }

}

export default Token