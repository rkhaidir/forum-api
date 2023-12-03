const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler({ payload, auth }, h) {
    const useCasePayload = {
      title: payload.title,
      body: payload.body,
      owner: auth.credentials.id,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      message: 'Thread berhasil ditambahkan',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request) {
    const useCasePayload = {
      threadId: request.params.threadId,
    };
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);
    const thread = await getThreadDetailUseCase.execute(useCasePayload);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadHandler;
