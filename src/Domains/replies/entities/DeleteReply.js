class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, commentId, threadId, owner,
    } = payload;

    this.id = id;
    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({
    id, commentId, threadId, owner,
  }) {
    if (!id || !commentId || !threadId || !owner) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof commentId !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
