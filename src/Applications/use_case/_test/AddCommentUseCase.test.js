const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Ayo beli game Coral Island',
      threadId: 'thread-234',
      owner: 'owner-123',
    };

    const mockPostedComment = new PostedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockPostedComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const postedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(postedComment).toStrictEqual(new PostedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new PostComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    }));
  });
});
