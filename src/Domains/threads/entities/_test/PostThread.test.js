const PostThread = require('../PostThread');

describe('a PostThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Mendapatkan benih beras',
    };

    // Action & Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 122333,
      body: [],
      owner: 333221,
    };

    // Action & Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Mendapatkan benih beras',
      body: 'Silahkan pergi ke toko Sam dari pukul 09:00 sampai 16:00',
      owner: 'user-123',
    };

    // Action
    const postThread = new PostThread(payload);

    // Assert
    expect(postThread.title).toEqual(payload.title);
    expect(postThread.body).toEqual(payload.body);
    expect(postThread.owner).toEqual(payload.owner);
  });
});
