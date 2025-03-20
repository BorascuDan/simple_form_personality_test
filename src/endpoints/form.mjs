import express from 'express';
import db from '../utils/db.mjs';
import { sendJsonResponse, generateSessionToken } from "../utils/utilFunctions.mjs";

const router = express.Router();

router.get('/questions', async (req, res) => {
    try {
        const form = await db('questions as q')
        .leftJoin('answers as a', 'q.id', 'a.question_id')
        .select([
            'q.id as question_id',
            'q.question_text as question_text',
            'a.id as answer_id'
        ]);
        
        if (form.length === 0) {
            return sendJsonResponse(res, true, 204, "Remember to run seeds", null);
        }
        
        // Generate a session token
        const sessionToken = generateSessionToken();
        
        // Store the token in the response headers
        res.header('X-Session-Token', sessionToken);
        
        // Store the token in the database (optional but recommended)
        await db('user_sessions').insert({
            session_token: sessionToken,
            created_at: new Date()
        });
        
        const questions = new Map();
        
        for (const question of form) {
            const key = [question.question_text, question.question_id];
            
            let existingKey = [...questions.keys()].find(k => 
                k[0] === key[0] && k[1] === key[1]
            );
            
            if (!existingKey) {
                questions.set(key, []);
                existingKey = key;
            }
            
            questions.get(existingKey).push(question.answer_id);
        }
        
        const questionArray = [...questions.entries()].map(([question, answerIds]) => ({
            question,
            answer_ids: answerIds
        }));
        
        sendJsonResponse(res, true, 200, "Success", questionArray);
    } catch (error) {
        console.error("Error fetching form: ", error);
        sendJsonResponse(res, false, 500, "Internal server error", null);
    }
});

router.post('/userResponse', async (req, res) => {
    try {
        const { 
            answers, 
            userData: { name, phoneNumber, dateOfInterest, when }, 
            permissions: { dataUsagePermission, marketingPermission } 
        } = req.body;
        
        const sessionToken = req.headers['x-session-token'];
        
        if (!sessionToken) {
            return sendJsonResponse(res, false, 400, "Session token is required", null);
        }

        if (!name) {
            return sendJsonResponse(res, false, 400, "Name is required", null);
        }

        if (!phoneNumber) {
            return sendJsonResponse(res, false, 400, "Phone number is required", null);
        }
        
        if (!dataUsagePermission) {
            return sendJsonResponse(res, false, 400, "Data usage permission is required", null);
        }

        if (!dataUsagePermission) {
            return sendJsonResponse(res, false, 400, "Marketing permission is required", null);
        }
        
        if (!dateOfInterest) {
            return sendJsonResponse(res, false, 400, "Date of interest is required", null);
        }
        
        if (!when || !['morning', 'lunch', 'evening'].includes(when)) {
            return sendJsonResponse(res, false, 400, "Valid time preference (morning/lunch/evening) is required", null);
        }

        const session = await db('user_sessions')
            .where({ session_token: sessionToken })
            .first();
            
        if (!session) {
            return sendJsonResponse(res, false, 401, "Invalid session token", null);
        }

        const userId = await db('users').insert({
            name,
            phone_number: phoneNumber,
            session_id: session.id,
            date_of_interest: dateOfInterest,
            when: when,
            created_at: new Date()
        }).returning('id');
        
        const userAnswers = answers.map(answer => ({
            user_id: userId[0],
            question_id: answer.question_id,
            answer_id: answer.answer_id,
            created_at: new Date()
        }));
        
        await db('user_responses').insert(userAnswers);
        
        sendJsonResponse(res, true, 200, "Form submitted successfully", null);
    } catch (error) {
        console.error("Error saving info: ", error);
        sendJsonResponse(res, false, 500, "Internal server error", null);
    }
});

export default router;