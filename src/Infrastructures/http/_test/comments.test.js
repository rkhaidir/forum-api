const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Komentar baru',
      };
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper
        .getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'Komentar baru',
      };
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-234';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'Komentar baru',
      };
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-234';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-234';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: [],
      };
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-234';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-234';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when request missing authentication', async () => {
      // Arrange
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-234';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-234';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/xxx/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-234';
      const commentId = 'comment-123';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });

    it('should response 403 when user not owner', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenUserIdHelper({ server });
      const threadId = 'thread-234';
      const commentId = 'comment-123';
      const otherUserId = 'user-234';

      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await UsersTableTestHelper.addUser({ id: otherUserId, username: 'otherUser' });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: otherUserId });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak boleh mengakses resource ini');
    });
  });
});
