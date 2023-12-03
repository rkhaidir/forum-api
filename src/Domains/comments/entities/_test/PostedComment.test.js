const PostedComment = require('../PostedComment');

describe('a PostedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Komentar dibuat',
    };

    // Action & Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: true,
      owner: 'owner-123',
    };

    // Action & Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Ayo main coral island',
      owner: 'user-123',
    };

    // Action
    const postedComment = new PostedComment(payload);

    // Assert
    expect(postedComment.id).toEqual(payload.id);
    expect(postedComment.content).toEqual(payload.content);
    expect(postedComment.owner).toEqual(payload.owner);
  });
});
