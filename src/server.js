const http = require('http');
const url = require('url');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  switch (url.parse(request.url).pathname) {
    case '/':
      responseHandler.getIndex(request, response);
      break;
    case '/style.css':
      responseHandler.getStylesheet(request, response);
      break;
    case '/success':
      responseHandler.getSuccess(request, response);
      break;
    case '/badRequest':
      responseHandler.getBadRequest(request, response);
      break;
    case '/unauthorized':
      responseHandler.getUnauthorized(request, response);
      break;
    case '/forbidden':
      responseHandler.getForbidden(request, response);
      break;
    case '/internal':
      responseHandler.getInternal(request, response);
      break;
    case '/notImplemented':
      responseHandler.getNotImplemented(request, response);
      break;
    default:
      responseHandler.getNotFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port, () => {});
