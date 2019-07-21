'use strict';

const _buildCurl = function (params) {
  if (!params.url) {
    console.error('Input missing: URL');
  }

  if (!params.verb) {
    console.error('Input missing: HTTP verb');
  }

  let _headers = '';
  let _body = '';

  try {
    if (params.headers) {
      for (let key in params.headers) {
        _headers += `-H '${key}:${params.headers[key]}' `;
      }

      if (params.body) {
        if (params.headers && params.headers['content-type'] && params.headers['content-type'] === 'application/json') {
          _body += `-d '${JSON.stringify(params.body)}' `;
        } else {
          for (let key in params.body) {
            _body += `-d '${key}=${params.body[key]}' `;
          }
        }
      }

      _headers.length ? _headers = _headers.substring(0, _headers.length - 1) : null;
      _body.length ? _body = _body.substring(0, _body.length - 1) : null;

      var curl = `curl ${_headers} -X ${params.verb.toUpperCase()} '${params.url}' ${_body}`
      return curl;
    }
  } catch (e) {
    console.log(e);
  }
};

const expressCurlMiddlewareFactory = function (options) {
  var opts = options || {};
  var log = typeof opts.log === 'boolean' ? opts.log : true;
  var logFn = opts.logFn || console.log;
  var attachToReq = typeof opts.attachToReq === 'boolean' ? opts.attachToReq : true;
  var strName = opts.strName || 'asCurlStr';

  return function (req, res, next) {
    if (log || attachToReq) {
      var curlParams = {};
      curlParams.url = req.protocol + '://' + (req.headers.host || req.hostname) + req.originalUrl;
      curlParams.verb = req.method.toUpperCase();
      req.headers ? curlParams.headers = req.headers : null;
      req.body ? curlParams.body = req.body : null;
      var asCurlStr = _buildCurl(curlParams);
      if (log) logFn(asCurlStr);
      if (attachToReq) req[strName] = asCurlStr;
    }

    next();
  }
}

module.exports = {
  expressCurlMiddlewareFactory,
  expressCurl: expressCurlMiddlewareFactory({
    attachToReq: false,
  })
}