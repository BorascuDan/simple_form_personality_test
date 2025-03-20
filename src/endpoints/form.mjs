import express from 'express';
import db from '../utils/db.mjs';
import { sendJsonResponse, generateSessionToken, correctAnswers } from "../utils/utilFunctions.mjs";

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
            return sendJsonResponse(res, true, 204, "Uitasi sa rulezi seedurile", null);
        }
        
        const sessionToken = generateSessionToken();

        res.header('X-Session-Token', sessionToken);
        
        await db('user_sessions').insert({
            session_token: sessionToken,
            created_at: new Date()
        });
        
        const groupedQuestions = [];
        const questionMap = new Map();

        for (const question of form) {
            const questionId = question.question_id;
            const questionText = question.question_text;
            const answerId = question.answer_id;
            
            let found = false;
            let existingQuestion = null;
            
            for (const [key, value] of questionMap) {
                if (key[0] === questionId && key[1] === questionText) {
                found = true;
                existingQuestion = value;
                break;
                }
            }
            
            if (!found) {
                const newQuestion = {
                    question_text: questionText,
                    question_id: questionId,
                    answer_ids: []
                };
                
                groupedQuestions.push(newQuestion);
                
                questionMap.set([questionId, questionText], newQuestion);
                
                existingQuestion = newQuestion;
            }
            
            existingQuestion.answer_ids.push(answerId);
        }

        sendJsonResponse(res, true, 200, "Success", groupedQuestions);
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
        
        if (!marketingPermission) {
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

        const existingUser = await db('users')
            .where({ session_id: session.id })
            .first();

        if (existingUser) {
            return sendJsonResponse(res, false, 409, "Response already submitted for this session", null);
        }
        
        const answerIds = [];

        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            answerIds.push(answer.answer_id);
          }

        let percentage = 0;
        for (let i = 0; i < correctAnswers.length; i++){
            if (answerIds[i] === correctAnswers[i]){
                percentage ++;
            }
        }

        percentage = (percentage / correctAnswers.length) * 100;

        await db('users').insert({
            name,
            phone_number: phoneNumber,
            percentage: percentage,
            session_id: session.id,
            date_of_interest: dateOfInterest,
            when: when,
            created_at: new Date()
        });

        sendJsonResponse(res, true, 200, "Procent calculated", percentage);
    } catch (error) {
        console.error("Error saving info: ", error);
        sendJsonResponse(res, false, 500, "Internal server error", null);
    }
});

router.post('/videoCall', async (req, res) => {
    try{
        const { call } = req.body; 

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

        const updatedCount = await db('users')
            .where({ session_id: session.id })
            .update({ call });

    if (updatedCount === 0) {
      return sendJsonResponse(res, false, 404, "User not found", null);
    }

        if (call === 0){
            sendJsonResponse(res, true, 200, "Iti multumim pentru raspunsuri!", null);
        } else if (call === 1){
            sendJsonResponse(res, true, 200, "te vom suna in scurt timp", null);
        }


    } catch (error) {
        console.error("Error saving info: ", error);
        sendJsonResponse(res, false, 500, "Internal server error", null);
    }
});

export default router;