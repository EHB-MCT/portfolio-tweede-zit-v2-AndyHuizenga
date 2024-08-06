// // routes/User.js
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const router = express.Router();

// // User registration
// router.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({ username, password: hashedPassword });
//     res.status(201).json({ id: newUser.id, username: newUser.username });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // User login

// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     // Find user by username
//     const user = await User.findOne({ where: { username } });

//     // Check if user exists
//     if (!user) {
//       return res.status(401).json({ error: 'User not found' });
//     }

//     // Check if password matches
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ error: 'Invalid password' });
//     }

//     // Generate JWT token upon successful login
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// module.exports = router;
