const jwt = require('jsonwebtoken')

// get user id
const getUserId = (req) => {
    const { authorization } = req.headers

    if (authorization && authorization.startsWith('Bearer')) {
        const token = authorization.split(' ')[1]
        const { _id } = jwt.verify(token, process.env.SECRET)
        return _id;
    } else {
        throw Error("Must provide an authorization token")
    }
}

module.exports = { getUserId }