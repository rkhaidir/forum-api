/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-234',
    title = 'Mendapatkan benih beras',
    body = 'Silahkan pergi ke toko Sam dari pukul 09:00 sampai 16:00',
    date = '2023-10-23T08:55:00.000Z',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
