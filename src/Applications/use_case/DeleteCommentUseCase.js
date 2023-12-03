const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);

    await this._threadRepository.verifyThreadAvailability(deleteComment.threadId);
    await this._commentRepository
      .verifyCommentAvailability(deleteComment.id, deleteComment.threadId);
    await this._commentRepository.verifyCommentOwner(deleteComment.id, deleteComment.owner);
    return this._commentRepository.deleteCommentById(deleteComment.id);
  }
}

module.exports = DeleteCommentUseCase;
