const Thread = require('../../../Domains/threads/entities/Thread');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/replies/entities/Reply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThread = new Thread({
      id: 'thread-123',
      title: 'Mendapatkan benih beras',
      body: 'Silahkan pergi ke toko Sam dari pukul 09:00 sampai 16:00',
      date: '2023-11-08T07:22:33.555Z',
      username: 'dicoding',
      comments: [],
    });

    const mockComments = [
      new Comment({
        id: 'comment-123',
        content: 'Ini comment pertama',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        isdeleted: true,
      }),

      new Comment({
        id: 'comment-234',
        content: 'Ini comment kedua',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        isdeleted: false,
      }),
    ];

    const mockReplies = [
      new Reply({
        id: 'reply-123',
        content: 'Ini reply pertama',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        commentId: 'comment-123',
        isdeleted: false,
      }),

      new Reply({
        id: 'reply-234',
        content: 'Ini reply kedua',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        commentId: 'comment-234',
        isdeleted: true,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const {
      isdeleted: isDeletedCommentA,
      ...commentA
    } = mockComments[0];
    const {
      isdeleted: isDeletedCommentB,
      ...commentB
    } = mockComments[1];

    const {
      commentId: commentIdReplyA, isdeleted: isDeletedReplyA,
      ...replyA
    } = mockReplies[0];
    const {
      commentId: commentIdReplyB, isdeleted: isDeletedReplyB,
      ...replyB
    } = mockReplies[1];

    const expectedCommentsToReplies = [
      { ...commentA, replies: [replyA] },
      { ...commentB, replies: [replyB] },
    ];

    getThreadDetailUseCase._checkDeletedComments = jest.fn()
      .mockImplementation(() => [commentA, commentB]);
    getThreadDetailUseCase._getRepliesToComments = jest.fn()
      .mockImplementation(() => expectedCommentsToReplies);

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(threadDetail).toEqual(new Thread({
      ...mockThread, comments: expectedCommentsToReplies,
    }));
    expect(getThreadDetailUseCase._checkDeletedComments).toBeCalledWith(mockComments);
    expect(getThreadDetailUseCase._getRepliesToComments)
      .toBeCalledWith([commentA, commentB], mockReplies);
  });

  it('should operate the branching in _checkDeletedComments function', async () => {
    // Arrange
    const mockComments = [
      new Comment({
        id: 'comment-123',
        content: 'Ini comment pertama',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        isdeleted: true,
      }),

      new Comment({
        id: 'comment-234',
        content: 'Ini comment kedua',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        isdeleted: false,
      }),
    ];

    const {
      isdeleted: isdeleteCommentA,
      ...commentA
    } = mockComments[0];
    const {
      isdeleted: isdeleteCommentB,
      ...commentB
    } = mockComments[1];
    const getThreadDetailUseCase = new GetThreadDetailUseCase(
      { threadRepository: {}, commentRepository: {}, replyRepository: {} },
    );
    const spyCheckDeletedComments = jest.spyOn(getThreadDetailUseCase, '_checkDeletedComments');

    // Action
    getThreadDetailUseCase._checkDeletedComments(mockComments);

    // Assert
    expect(spyCheckDeletedComments).toReturnWith([
      { ...commentA, content: '**komentar telah dihapus**' },
      commentB,
    ]);
    spyCheckDeletedComments.mockClear();
  });

  it('should operate the branching in _getRepliesToComments function', async () => {
    // Arrange
    const mockComments = [
      {
        id: 'comment-123',
        content: '**komentar telah dihapus**',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        replies: [],
      },
      {
        id: 'comment-234',
        content: 'Ini comment kedua',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        replies: [],
      },
    ];
    const mockReplies = [
      new Reply({
        id: 'reply-123',
        content: 'Ini reply pertama',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        commentId: 'comment-123',
        isdeleted: false,
      }),

      new Reply({
        id: 'reply-234',
        content: 'Ini reply kedua',
        username: 'dicoding',
        date: '2023-11-08T07:22:33.555Z',
        commentId: 'comment-234',
        isdeleted: true,
      }),
    ];

    const getThreadDetailUseCase = new GetThreadDetailUseCase(
      { threadRepository: {}, commentRepository: {}, replyRepository: {} },
    );

    const {
      commentId: commentIdReplyA, isdeleted: isdeleteReplyA,
      ...replyA
    } = mockReplies[0];
    const {
      commentId: commentIdReplyB, isdeleted: isdeleteReplyB,
      ...replyB
    } = mockReplies[1];

    const expectedCommentsToReplies = [
      { ...mockComments[0], replies: [{ ...replyA }] },
      { ...mockComments[1], replies: [{ ...replyB, content: '**balasan telah dihapus**' }] },
    ];

    const spyGetRepliesToComments = jest.spyOn(getThreadDetailUseCase, '_getRepliesToComments');

    // Action
    getThreadDetailUseCase._getRepliesToComments(mockComments, mockReplies);

    // Assert
    expect(spyGetRepliesToComments).toReturnWith(expectedCommentsToReplies);
    spyGetRepliesToComments.mockClear();
  });
});
