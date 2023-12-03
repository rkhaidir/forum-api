class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isdeleted,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isdeleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({
    id, username, date, content, isdeleted,
  }) {
    if (!id || !username || !date || !content) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || typeof isdeleted !== 'boolean'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
