import * as mongodb from 'mongodb'
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import Settings from "../../../settings.js"
import Token from "../../../tools/jwt.js"

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: Settings.google.client_id,
            clientSecret: Settings.google.client_secret,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    secret: Settings.nextauth.nextauth_secret,
    callbacks: {
        async signIn({ user, account, profile }) {
            const databaseUrl = Settings.db.url
            const databaseName = Settings.db.name

            const { MongoClient } = mongodb
            const client = new MongoClient(databaseUrl, { monitorCommands: true })
            await client.connect()
            const db = client.db(databaseName)

            const filter = {
                username: profile.email
            }

            try {
                const user = await db.collection("users").findOne(filter)
                if (!user) {
                    const data = {
                        username: profile.email,
                        provider: 'google'
                    }
                    await db.collection("users").insertOne(data)

                }
            }
            catch { return false }

            return true
        },
        async jwt({ token, user, account }) {
            if (account) {

                const newToken = new Token()
                const payload = { username: user.email, provider: 'google' }
                const secret = Settings.security.jwt.secret
                const options = {
                    subject: String(user._id),
                    audience: 'https://nikolaos-nikolovrestaurantapplication.mymit.eu',
                    issuer: 'nikos.nikolov@mtel.gr',
                }
                const jwt = await newToken.create(payload, secret, options)
                token.token = jwt;
            }
            return token;
        },
        async session({ session, token, user }) {
            session.token = token.token;
            return session;
        }
    }
})