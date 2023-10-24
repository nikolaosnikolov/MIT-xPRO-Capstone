
const memo = {}

const cart = {
    update: (properties) => {

        const { id, symbol } = properties

        memo.cart === undefined && (memo.cart = JSON.parse(localStorage.cart))
        const record = id && memo.cart.items.find(item => item._id === id)

        record && symbol === '+' && (() => {
            record.quantity++
            record.total = record.quantity * record.price
        })()
        record && symbol === '-' && (() => {
            record.quantity--
            record.total = record.quantity * record.price
        })()
        record && record.quantity === 0 && (() => {
            const filter = (index) => index.quantity === 0
            const filtered = memo.cart.items.findIndex(filter)
            memo.cart.items.splice(filtered, 1)
        })()

        cart.save()
    },
    save: () => {
        memo.cart !== undefined && (localStorage.cart = JSON.stringify(memo.cart))
    }
}

export default cart