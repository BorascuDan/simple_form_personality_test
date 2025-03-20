/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('user_responses', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.integer('question_id').unsigned().references('id').inTable('questions').onDelete('CASCADE');
        table.integer('answer_id').unsigned().references('id').inTable('answers').onDelete('CASCADE');
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema .dropTableIfExists('user_responses')
};
