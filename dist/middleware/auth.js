import { verifyToken } from '../services/authService.js';
export function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing token' });
        return;
    }
    try {
        const payload = verifyToken(header.slice(7));
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
//# sourceMappingURL=auth.js.map