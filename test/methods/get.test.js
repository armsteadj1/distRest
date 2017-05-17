import { expect } from 'chai';
import { start, stop } from "../../src/server";
import { get, post } from "../helpers/api";
import { NOT_FOUND, OK } from "http-status-codes";
import shrug from '../helpers/shrug';
import { TOSS_STATUS_CODE } from "../helpers/execptions";

const method = 'GET';

describe(method, () => {
  let expected, path, server;

  beforeEach(() => {
    expected = shrug.word();
    path = `/${expected}/${method}`;
  });

  afterEach(() => {
    stop(server);
  });

  it('specifying a get will produce a 200', () => {
    server = start({ paths: [ { path, method, response: expected } ] });

    return get(path).then(({ body, statusCode }) => {
      expect(statusCode).to.equal(OK);
      expect(body).to.equal(expected);
    });
  });

  it('case insensitive get will produce a 200', () => {
    server = start({ paths: [ { path, method: 'GeT', response: expected } ] });

    return get(path).then(({ body, statusCode }) => {
      expect(statusCode).to.equal(OK);
      expect(body).to.equal(expected);
    });
  });

  it(`only response to ${method}`, () => {
    server = start({ paths: [ { path, method: 'GET', response: expected } ] });

    return post(path)
      .then(() => TOSS_STATUS_CODE('NOT 404'))
      .catch(({ response }) => expect(response.statusCode).to.equal(NOT_FOUND));
  });
});
