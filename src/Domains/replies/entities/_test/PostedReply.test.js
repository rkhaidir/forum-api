const PostedReply = require('../PostedReply');

describe('a PostedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      content: 'Coral island bentar lagi rilis',
    };

    // Action & Assert
    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      content: 'Coral island bentar lagi rilis',
      owner: [],
    };

    // Action & Assert
    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create PostedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      content: 'Coral island bentar lagi rilis',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new PostedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
