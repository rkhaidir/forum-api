const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const Comment = require('../../../Domains/comments/entities/Comment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepository postgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-234', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist post comment and return posted comment correctly', async () => {
      // Arrange
      const postComment = new PostComment({
        content: 'ini komen pertama',
        threadId: 'thread-234',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(postComment);
      const comment = await CommentsTableTestHelper.getCommentById(addedComment.id);

      // Assert
      expect(addedComment).toStrictEqual(new PostedComment({
        id: 'comment-123',
        content: postComment.content,
        owner: postComment.owner,
      }));
      expect(comment).toHaveLength(1);
    });

    it('should return posted comment correctly', async () => {
      // Arrange
      const postComment = new PostComment({
        content: 'ini komen pertama',
        threadId: 'thread-234',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(postComment);

      // Assert
      expect(addedComment).toStrictEqual(new PostedComment({
        id: 'comment-123',
        content: postComment.content,
        owner: postComment.owner,
      }));
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment is not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
      );

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123', 'thread-234')).rejects.toThrowError(NotFoundError);
    });

    it('should resolves and not throw NotFoundError when comment is found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123', 'thread-234')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when comment owner is not the same as the payload', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456')).rejects.toThrowError(AuthorizationError);
    });

    it('should resolve and not throw AuthorizationError when owner is the same as the payload', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment is not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should delete comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comment = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(comment[0].is_deleted).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const firstComment = {
        id: 'comment-123',
        content: 'ini komen pertama',
        owner: 'user-123',
        date: '2023-11-26T09:20:00.000Z',
        threadId: 'thread-234',
        isdeleted: false,
      };
      const secondComment = {
        id: 'comment-234',
        content: 'ini komen kedua',
        owner: 'user-123',
        date: '2023-12-26T09:20:00.000Z',
        threadId: 'thread-234',
        isdeleted: false,
      };
      await CommentsTableTestHelper.addComment(firstComment);
      await CommentsTableTestHelper.addComment(secondComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-234');

      // Assert
      expect(comments).toEqual([
        new Comment({ ...firstComment, username: 'dicoding' }),
        new Comment({ ...secondComment, username: 'dicoding' }),
      ]);
    });
  });
});
