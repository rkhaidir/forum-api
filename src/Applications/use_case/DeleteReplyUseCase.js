const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(deleteReply.threadId);
    await this._commentRepository
      .verifyCommentAvailability(deleteReply.commentId, deleteReply.threadId);
    await this._replyRepository.verifyReplyAvailability(
      deleteReply.id,
      deleteReply.commentId,
      deleteReply.threadId,
    );
    await this._replyRepository.verifyReplyOwner(
      deleteReply.id,
      deleteReply.owner,
    );
    return this._replyRepository.deleteReplyById(deleteReply.id);
  }
}

module.exports = DeleteReplyUseCase;
