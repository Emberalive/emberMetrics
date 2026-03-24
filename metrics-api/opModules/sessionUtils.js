const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const SESSIONS_FILE = './sessions.json';
const SESSION_EXPIRY_HOURS = 24;

const getSession = async (sessionId) => {
    const sessions = await readSessions();
    const session = sessions.find(s => s.sessionId === sessionId);
    if (!session) return false;
    if (new Date(session.expiresAt) < new Date()) {
        await deleteSession(sessionId);
        return false;
    }
    return session;
};

const readSessions = () => {
    const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data).sessions;
};

const writeSessions = (sessions) => {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions }, null, 2));
};

const createSession = (userId) => {
    const sessions = readSessions();

    const session = {
        sessionId: uuidv4(),
        userId,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()
    };

    sessions.push(session);
    writeSessions(sessions);

    return session.sessionId;
};

const deleteSession = (sessionId) => {
    const sessions = readSessions();
    const filtered = sessions.filter(s => s.sessionId !== sessionId);
    writeSessions(filtered);
};

const cleanExpiredSessions = () => {
    const sessions = readSessions();
    const now = new Date();
    const valid = sessions.filter(s => new Date(s.expiresAt) > now);
    writeSessions(valid);
};

module.exports = { createSession, deleteSession, cleanExpiredSessions, getSession };