const crypto = require('crypto')

const algorithm = 'aes-256-ctr'
const iv = crypto.randomBytes(16)

const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, process.env.HASHED_KEY, iv)

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    }
}

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, process.env.HASHED_KEY, Buffer.from(hash.iv, 'hex'))

    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrypted.toString()
}

module.exports = {
    encrypt,
    decrypt
}