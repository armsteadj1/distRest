import http from 'http';
import validate from './validatePath.service';
import loadBody from './body.service';

const current = (url, paths) => paths.find((p) => p.path === url.split('?')[ 0 ]);

const create = (paths) =>
  http.createServer((req, res) => {
    const path = current(req.url, paths);

    loadBody(req, (body) => {
      if (validate(req, body, path))
        res.end(path.response);
      else {
        res.writeHead(404);
        res.end('These are not the paths you are looking for.');
      }
    });
  });

export default create;
