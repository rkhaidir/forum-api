const PostReply = require('../../Domains/replies/entities/PostReply');

class AddReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const postReply = new PostReply(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(postReply.threadId);
    await this._commentRepository
      .verifyCommentAvailability(postReply.commentId, postReply.threadId);
    return this._replyRepository.addReply(postReply);
  }
}

module.exports = AddReplyUseCase;
