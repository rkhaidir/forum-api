const Thread = require('../Thread');

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-234',
      title: 'Mendapatkan benih beras',
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'Mendapatkan benih beras',
      body: [],
      date: 123,
      username: 123,
      comments: [],
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-234',
      title: 'Mendapatkan benih beras',
      body: 'Lorem ipsum',
      date: '2020-01-01T00:00:00.000Z',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
    expect(thread.comments).toEqual(payload.comments);
    expect(Array.isArray(thread.comments)).toBe(true);
  });
});
