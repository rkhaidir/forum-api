const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-234',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-234',
      owner: [],
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-234',
      owner: 'user-123',
    };

    // Action
    const { id, threadId, owner } = new DeleteComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
