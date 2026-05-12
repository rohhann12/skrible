import { Router } from 'express';
import { register, login } from '../services/authService.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }
        const user = await register(email, password);
        res.status(201).json({ token: user });
    }
    catch (err) {
        console.log("err", err);
        res.status(400).json({ error: 'Registration failed' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }
        const token = await login(email, password);
        res.json({ "token": token });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        res.status(401).json({ error: message });
    }
});
router.get('/me', authenticate, (req, res) => {
    res.json({ user: req.user });
});
export default router;
//# sourceMappingURL=auth.js.map