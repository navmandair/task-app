const jwt = require('jsonwebtoken')
const User = require('../db/modals/user')

const jwtAuthTokenSignKey = process.env.JWT_TOKEN_KEY || 'NodeJSCourse'

const auth = async (req, res, next)=>{
    try{
        const token = (req.header('Authorization') || '').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, jwtAuthTokenSignKey)
        const user = await User.findOne({'_id': decodedToken._id, 'tokens.token': token})
        if(!user){
            throw new Error ('Invalid Auth Token')
        }
        else {
            req.token = token
            req.user = user
            next()
        }
        
    } catch(error){
        res.status(401).send({message: error.message})
    }
    
}

module.exports = auth;