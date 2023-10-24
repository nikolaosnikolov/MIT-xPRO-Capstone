const Settings = {
    db: {
        url: 'mongodb://mongo.mymit.eu/restaurantsapp?retryWrites=true&w=majority',
        name: 'restaurantsapp'
    },
    security: {
        jwt: {
            secret: 'as2p(jjh^ydgr$$#1fa@1mfnnaht%',
        }
    },
    google: {
        client_id: '1082166066570-rq54j21sip25001ajg9mdfghod590d1g.apps.googleusercontent.com',
        client_secret: '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'
    },
    nextauth: {
        nextauth_secret: '64fcb9497610b8224a8dd83cc3e6367d'
    }
}

export default Settings