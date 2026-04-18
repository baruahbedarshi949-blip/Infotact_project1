const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid user session' });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// ✅ IMPORTANT EXPORT
module.exports = { protect };

// const User = require('../models/User');
// const { verifyToken } = require('../utils/jwt');

// async function protect(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = verifyToken(token);
//     const user = await User.findById(decoded.userId).select('-password');

//     if (!user || !user.isActive) {
//       return res.status(401).json({ message: 'Invalid user session' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// }

// module.exports = { protect };
