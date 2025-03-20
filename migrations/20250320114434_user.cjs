exports.up = function(knex) {
    return knex.schema
    .createTable('users', table => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('phone_number').notNullable();
            table.integer('percentage')
            table.integer('call')
            table.integer('session_id').unsigned().references('id').inTable('user_sessions');
            table.date('date_of_interest').notNullable();
            table.enu('when', ['morning', 'lunch', 'evening']).notNullable();
            table.timestamps(true, true);
        })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
