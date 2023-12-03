class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    thread.comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const threadReplies = await this._replyRepository.getRepliesByThreadId(threadId);

    thread.comments = this._checkDeletedComments(thread.comments);
    thread.comments = this._getRepliesToComments(thread.comments, threadReplies);

    return thread;
  }

  _checkDeletedComments(comments) {
    for (let i = 0; i < comments.length; i += 1) {
      delete comments[i].isdeleted;
    }
    return comments;
  }

  _getRepliesToComments(comments, threadReplies) {
    for (let i = 0; i < comments.length; i += 1) {
      const commentsId = comments[i].id;
      comments[i].replies = threadReplies
        .filter((reply) => reply.commentId === commentsId)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          delete reply.isdeleted;
          return replyDetail;
        });
    }
    return comments;
  }
}

module.exports = GetThreadDetailUseCase;
