const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] });
    if (exists) return res.status(409).json({ message: 'Username or email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      username, 
      email, 
      passwordHash,
      balance: 0,
      wallet: 0,
      transactions: []
    });
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
    return res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        username: user.username, 
        email: user.email,
        balance: user.balance || 0,
        wallet: user.wallet || 0
      } 
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) return res.status(400).json({ message: 'Missing credentials' });
    const query = usernameOrEmail.includes('@') ? { email: usernameOrEmail.toLowerCase() } : { username: usernameOrEmail.toLowerCase() };
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


