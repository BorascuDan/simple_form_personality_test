/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('questions').del()
  await knex('questions').insert([
    {id: 1, question_text: 'q1'},
    {id: 2, question_text: 'q2'},
    {id: 3, question_text: 'q3'},
    {id: 4, question_text: 'q4'},
    {id: 5, question_text: 'q5'},
    {id: 6, question_text: 'q6'},
    {id: 7, question_text: 'q7'},
    {id: 8, question_text: 'q8'},
    {id: 9, question_text: 'q9'},
    {id: 10, question_text: 'q10'},
  ]);
};
