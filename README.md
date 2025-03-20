CREATE TABLE:
npx knex migrate:make create_users_table --knexfile knexfile.cjs

RUN MIGRATIONS:
npx knex migrate:latest --knexfile knexfile.cjs

ROLLBACK:
npx knex migrate:rollback --knexfile knexfile.cjs

ALTER:
npx knex migrate:make rename_scoialMediaToken_to_socialMediaToken --knexfile knexfile.cjs

create seed:
npx knex seed:make departments_seed

run seed:
npx knex seed:run --knexfile knexfile.cjs

specific seed
npx knex seed:run --specific=positions_seed.cjs --knexfile knexfile.cjs
