import express from 'express';
import db from '../utils/db.mjs';
import { sendJsonResponse } from "../utils/utilFunctions.mjs";

const router = express.Router();

router.get('/checkSession', async (req, res) => {
    try {
        const sessionToken = req.headers['x-session-token'];
        
        if (!sessionToken) {
            return sendJsonResponse(res, false, 400, "Session token is required", null);
        }
        
        const session = await db('user_sessions')
            .where({ session_token: sessionToken })
            .first();
            
        if (!session) {
            return sendJsonResponse(res, false, 401, "Invalid session token", null);
        }
        
        sendJsonResponse(res, true, 200, "Valid session", null);
    } catch (error) {
        console.error("Error checking session: ", error);
        sendJsonResponse(res, false, 500, "Internal server error", null);
    }
});

export default router;