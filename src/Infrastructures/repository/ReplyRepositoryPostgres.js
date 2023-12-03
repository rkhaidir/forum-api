const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const PostedReply = require('../../Domains/replies/entities/PostedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const Reply = require('../../Domains/replies/entities/Reply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(postReply) {
    const { content, commentId, owner } = postReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, owner, content, date],
    };

    const { rows } = await this._pool.query(query);

    return new PostedReply({ ...rows[0] });
  }

  async verifyReplyAvailability(id, commentId, threadId) {
    const query = {
      text: `SELECT * FROM replies
            INNER JOIN comments ON replies.comment_id = comments.id
            WHERE replies.id = $1
            AND replies.comment_id = $2
            AND comments.thread_id = $3`,
      values: [id, commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak boleh mengakses resource ini');
    }
  }

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT 
            replies.id, replies.content, replies.date, users.username,
            replies.is_deleted, replies.comment_id
            FROM replies 
            INNER JOIN users ON replies.owner = users.id
            INNER JOIN comments ON replies.comment_id = comments.id
            WHERE comments.thread_id = $1 ORDER BY replies.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((rp) => new Reply({
      ...rp, commentId: rp.comment_id, isdeleted: rp.is_deleted,
    }));
  }
}

module.exports = ReplyRepositoryPostgres;
