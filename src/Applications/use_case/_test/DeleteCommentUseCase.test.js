const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      threadId: 'thread-234',
      owner: 'user-123',
    };
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toBeCalledWith(useCasePayload.id, useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.id, useCasePayload.owner);
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCasePayload.id);
  });
});
