const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config('./.env')

const { checkAuth } = require('./checkAuth')
const { generateAccessToken, generateRefreshToken } = require('./tokenGenerator')

const app = express()

app.use(express.json())

// Typically store refresh tokens in a database
let refreshTokens = []

app.get('/posts', checkAuth, (req, res) => {
	res.json({
		msg: 'Logged in',
		loggedUser: req.userData.name
	})
})

app.post('/login', (req, res) => {
	const { username } = req.body
	const user = {
		name: username
	}

	const accessToken = generateAccessToken(user)
	const refreshToken = generateRefreshToken(user)
	refreshTokens.push(refreshToken)
	res.json({ accessToken, refreshToken })
})

app.post('/token', (req, res) => {
	const { refreshToken } = req.body
	if (!refreshToken) return res.sendStatus(401).json({
		msg: 'Refresh token not provided!!'
	})
	if (!refreshTokens.includes(refreshToken)) {
		return res.status(403).json({
			msg: 'Refresh token not valid!!'
		})
	}

	try {
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
		console.log(decoded)

		const accessToken = generateAccessToken({ name: decoded.name })
		res.json({ accessToken })
	}
	catch (err) {
		return res.status(401).json({
			message: 'Login failed!!',
			error: err
		})
	}
})

app.delete('/logout', (req, res) => {
	const { refreshToken } = req.body
	refreshTokens = refreshTokens.filter(token => token !== refreshToken)
	res.status(204).json({
		message: 'Refresh token deleted successfully!'
	})
})

app.listen("3000", console.log("Server running"))