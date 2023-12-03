class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, commentId, isdeleted,
    } = payload;

    this.id = id;
    this.content = isdeleted ? '**balasan telah dihapus**' : content;
    this.date = date;
    this.username = username;
    this.commentId = commentId;
  }

  _verifyPayload({
    id, content, date, username, commentId, isdeleted,
  }) {
    if (!id || !content || !date || !username || !commentId) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || typeof commentId !== 'string'
      || typeof isdeleted !== 'boolean'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
