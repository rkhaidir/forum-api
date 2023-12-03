const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-234',
      commentId: 'comment-123',
      threadId: 'thread-234',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockReplyRepository.verifyReplyAvailability)
      .toBeCalledWith(useCasePayload.id, useCasePayload.commentId, useCasePayload.threadId);
    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith(useCasePayload.id, useCasePayload.owner);
    expect(mockReplyRepository.deleteReplyById)
      .toBeCalledWith(useCasePayload.id);
  });
});
