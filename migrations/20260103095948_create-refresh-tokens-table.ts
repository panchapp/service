import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  try {
    // Create refresh_tokens table
    await knex.schema.createTable('refresh_tokens', (table) => {
      table
        .uuid('user_id')
        .primary()
        .unique()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.text('token_hash').notNullable();
      table.timestamp('expires_at', { useTz: true }).notNullable();

      // Indexes for performance
      table.index('user_id');
    });
  } catch (error) {
    console.error(
      'Error during 20260103095948_create-refresh-tokens-table migration up:',
      error,
    );
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  try {
    await knex.schema.dropTableIfExists('refresh_tokens');
  } catch (error) {
    console.error(
      'Error during 20260103095948_create-refresh-tokens-table migration down:',
      error,
    );
    throw error;
  }
}
