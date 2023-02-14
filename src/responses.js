const fs = require('fs');
const url = require('url');
const query = require('querystring');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const stylesheet = fs.readFileSync(`${__dirname}/../client/style.css`);

function getXMLorJSON(request, response, status, message, id) {
  const accept = request.headers.accept.split(',');
  if (accept.indexOf('application/xml') !== -1 && (accept.indexOf('application/json') || (accept.indexOf('application/xml') < accept.indexOf('application/json')))) {
    response.writeHead(status, { 'Content-Type': 'application/xml' });
    if (request.method === 'GET') {
      response.write(`<message>${message}</message><id>${id}</id>`);
    }
  } else {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    if (request.method === 'GET') {
      response.write(`
      {
        "message": "${message}",
        "id": "${id}"
      }
      `);
    }
  }

  response.end();
}

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  if (request.method === 'GET') {
    response.write(index);
  }
  response.end();
};

const getStylesheet = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  if (request.method === 'GET') {
    response.write(stylesheet);
  }
  response.end();
};

const getSuccess = (request, response) => {
  getXMLorJSON(request, response, 200, 'Your request was successful!', 'OK');
};

const getBadRequest = (request, response) => {
  if (query.parse(url.parse(request.url).query).valid === 'true') {
    getXMLorJSON(request, response, 200, 'Great, your bad request was valid somehow?', 'OK');
  } else {
    getXMLorJSON(request, response, 400, 'Oops, looks like that was a bad request!', 'Bad Request');
  }
};

const getUnauthorized = (request, response) => {
  if (query.parse(url.parse(request.url).query).loggedIn === 'yes') {
    getXMLorJSON(request, response, 200, 'You are logged in and may view this page.', 'OK');
  } else {
    getXMLorJSON(request, response, 401, "Missing loggedIn query parameter set to yes", 'Unauthorized');
  }
};

const getForbidden = (request, response) => {
  getXMLorJSON(request, response, 403, "You do not have access to this content.", 'Forbidden');
};

const getInternal = (request, response) => {
  getXMLorJSON(request, response, 500, "Internal Service Error. Something went wrong.", 'Internal Server Error');
};

const getNotImplemented = (request, response) => {
  getXMLorJSON(request, response, 501, 'A get request for this page has not been implemented yet.', 'Not Implemented');
};

const getNotFound = (request, response) => {
  getXMLorJSON(request, response, 501, 'The page you ae looking for was not found.', 'Resource Not Found');
};

module.exports = {
  getIndex,
  getStylesheet,
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
