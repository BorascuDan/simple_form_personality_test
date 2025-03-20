/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('answers', (table) => {
        table.increments('id').primary();
        table.integer('question_id').unsigned().references('id').inTable('questions').onDelete('CASCADE');
        table.timestamps(true, true);
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema .dropTableIfExists('answers')
};
