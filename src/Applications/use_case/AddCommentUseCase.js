const PostComment = require('../../Domains/comments/entities/PostComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const postComment = new PostComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(postComment.threadId);
    return this._commentRepository.addComment(postComment);
  }
}

module.exports = AddCommentUseCase;
