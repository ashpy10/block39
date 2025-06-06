import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).send({
            error: 'No token provided',
            message: 'You must be logged in to access this route'
        });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).send({
            error: 'Invalid token format',
            message: 'Authorization header must be in the format: Bearer <token>'
        });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        
        next();
    } catch (error) {
        return res.status(401).send({
            error: 'Invalid token',
            message: 'The provided token is invalid or has expired'
        });
    }
} 