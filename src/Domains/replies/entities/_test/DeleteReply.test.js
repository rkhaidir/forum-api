const DeleteReply = require('../DeleteReply');

describe('a DeleteReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      commentId: 'comment-123',
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      commentId: 'comment-123',
      threadId: [],
      owner: [],
    };

    // Action & Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      commentId: 'comment-123',
      threadId: 'thread-234',
      owner: 'user-123',
    };

    // Action
    const {
      id, commentId, threadId, owner,
    } = new DeleteReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
