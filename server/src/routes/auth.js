import express from 'express';

const router = express.Router();

// Placeholder login route - to be wired with DB/JWT later
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  // For now, just echo back; replace with real validation + JWT
  return res.json({
    success: true,
    user: { id: 'placeholder', email, role: 'teacher' },
    token: 'fake-jwt-token',
  });
});

export default router;

