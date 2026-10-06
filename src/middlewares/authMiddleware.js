const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: 'Token não informado'
            });
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            return res.status(401).json({
                message: 'Token inválido'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: Number(decoded.sub),
            role: decoded.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Token inválido ou expirado'
        });
    }
}

module.exports = authMiddleware;