import crypto from 'crypto';

export function sendJsonResponse(res, success, status, message, data) {
    res.status(status).json({ success: success, message: message, data: data });
}

export function generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
}

export const correctAnswers = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];