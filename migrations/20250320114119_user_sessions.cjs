
exports.up = function(knex) {
    return knex.schema
    .createTable('user_sessions', table => {
            table.increments('id').primary();
            table.string('session_token').notNullable().unique();
            table.timestamps(true, true);
        })
};

exports.down = function(knex) {
    return knex.schema .dropTableIfExists('user_sessions')
};
