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
    {id: 3, question_text: 'q3'}
  ]);
};
