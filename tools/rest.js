const Rest = async (url = '', data = {}) => {




    const init = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    }

    if (!['/api/login', '/api/signup'].includes(url)) {
        const diff = localStorage.tokenUpdate - localStorage.tokenIat * 1000

        if ((localStorage.tokenExp * 1000 + diff) < (new Date).getTime()) {
            // updatetoken
        }

        init.headers.Authorization = `Bearer ${localStorage.token}`
    }

    const response = await fetch(url, init)

    return response.json()
}

export default Rest