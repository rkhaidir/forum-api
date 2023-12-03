const PostReply = require('../../../Domains/replies/entities/PostReply');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'Ini adalah reply',
      commentId: 'comment-123',
      threadId: 'thread-234',
      owner: 'user-123',
    };

    const mockPostedReply = new PostedReply({
      id: 'reply-234',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(mockPostedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const postedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(postedReply).toStrictEqual(new PostedReply({
      id: 'reply-234',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.verifyThreadAvailability)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAvailability)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(new PostReply(useCasePayload));
  });
});
