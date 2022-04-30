const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ msg: 'Token not defined!!' })

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userData = decoded
        next()
    }
    catch (err) {
        return res.status(401).json({
            message: 'Login failed!!',
            error: err
        })
    }
}

module.exports = { checkAuth }