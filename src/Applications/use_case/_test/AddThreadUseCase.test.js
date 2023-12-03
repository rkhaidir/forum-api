const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Mendapatkan benih beras',
      body: 'Silahkan pergi ke toko Sam dari pukul 09:00 sampai 16:00',
      owner: 'user-123',
    };
    const mockPostedThread = new PostedThread({
      id: 'thread-234',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    // creating depedency of use case
    const mockThreadRepository = new ThreadRepository();

    // Mocking needed function
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockPostedThread));

    // Creating use case instance
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const postedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(postedThread).toStrictEqual(new PostedThread({
      id: 'thread-234',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new PostThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  });
});
