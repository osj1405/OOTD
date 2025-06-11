import jwt from 'jsonwebtoken';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user; // req.user로 유저 정보 전달
    next();
  });
}

// 사용 예
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
