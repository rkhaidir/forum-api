const Reply = require('../Reply');

describe('a Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      content: 'Coral island bentar lagi rilis',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      content: 'Coral island bentar lagi rilis',
      date: [],
      username: [],
      commentId: [],
      isdeleted: false,
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      content: 'Coral island bentar lagi rilis',
      date: '2023-11-01T00:00:00.000Z',
      username: 'dicoding',
      commentId: 'comment-123',
      isdeleted: false,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
    expect(reply.commentId).toEqual(payload.commentId);
  });

  it('should create deleted Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-234',
      content: 'Coral island bentar lagi rilis',
      date: '2023-11-01T00:00:00.000Z',
      username: 'dicoding',
      commentId: 'comment-123',
      isdeleted: true,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual('**balasan telah dihapus**');
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
    expect(reply.commentId).toEqual(payload.commentId);
  });
});
