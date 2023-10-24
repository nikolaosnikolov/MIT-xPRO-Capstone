

const Gen = {}
const Calc = {}

// ----------------------------- Calculation Functions -----------------------------------------------------

Calc.round = (x, n) =>  // x = Number , n = Decimals
    parseFloat(Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n)

Calc.roundup = (x, n) =>  // x = Number , n = Decimals
    x >= 0
        ? parseFloat(Math.ceil(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n)
        : parseFloat(-Math.ceil(-x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n)

Calc.rounddown = (x, n) =>  // x = Number , n = Decimals
    x >= 0
        ? parseFloat(Math.floor(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n)
        : parseFloat(-Math.floor(-x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n)

Calc.isHex = (hexa) => {
    const string = hexa ? hexa.toLowerCase() : ''
    const number = parseInt(string, 16);
    return (number.toString(16) === string.toLowerCase())
}

Calc.isOctal = (octal) => {
    const string = octal || ''
    const number = parseInt(octal, 8);
    return (number.toString(8) === string || number.toString(8).padStart(string.length, '0') === string)
}

Calc.isUuid = (uuid) => {

    return Boolean(typeof uuid === 'string' && uuid.length === 36)
        ? uuid
            .split`-`
            .every((h, l, u) => u[4] && -`0x${h}1` && h.length - '40008'[l] == 4)
        : false

}
Calc.mod = (n, m) => (n % m + m) % m

// ----------------------------- Generation Functions -----------------------------------------------------


Gen.RandomHex = (length) => {
    !(Number.isInteger(length) === true && length > 0 && length < 50)
        && (length = 1)
    const lengthMax = 4
    const min = Math.pow(16, Math.min(length, lengthMax) - 1)
    const max = Math.pow(16, Math.min(length, lengthMax)) - 1
    const number = Math.floor(Math.random() * (max - min + 1)) + min
    let r = number.toString(16)
    while (r.length < length) {
        r = r + Gen.RandomHex(length - lengthMax)
    }
    return r
}

Gen.RandomDecimal = (length) => {
    !(Number.isInteger(length) === true && length > 0 && length < 50)
        && (length = 1)
    const lengthMax = 4
    const min = Math.pow(10, Math.min(length, lengthMax) - 1)
    const max = Math.pow(10, Math.min(length, lengthMax)) - 1
    const number = Math.floor(Math.random() * (max - min + 1)) + min
    let r = number.toString(10)
    while (r.length < length) {
        r = r + Gen.RandomDecimal(length - lengthMax)
    }
    return r
}

Gen.uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}




export { Gen ,Calc}
