/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('answers').del()
  await knex('answers').insert([
    {question_id: 1},
    {question_id: 2},
    {question_id: 3},
    {question_id: 3},
  ]);
};
