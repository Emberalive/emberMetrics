const { getSession } = require('./sessionUtils');
const { getUserById } = require('./user')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authenticate = async (req, res, next) => {
    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
        return res.status(401).json({ success: false, error: 'No session provided' });
    }

    const session = await getSession(sessionId);
    if (!session) {
        return res.status(401).json({ success: false, error: 'Invalid or expired session' });
    }

    const userData = await getUserById(session.userId);
    if (!userData.success || !userData.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (!userData.user.active) {
        return res.status(403).json({ success: false, error: 'Account suspended' });
    }

    req.user = userData.user;
    next();
};

module.exports = { authenticate };