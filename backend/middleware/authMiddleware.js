const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers
    
    if (authorization && authorization.startsWith('Bearer')) {
        const token = authorization.split(' ')[1]

        try {
            const { _id } = jwt.verify(token, process.env.SECRET)
            req.user = await User.findById(_id);
            next()
        } catch (error) {
            res.status(401).json( 'Request is not authorized' )
        }
    } else {
        res.status(401).json( 'Authorization token required' )
    }
}

module.exports = { requireAuth }