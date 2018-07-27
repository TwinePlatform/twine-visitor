const test = require('tape');
const Joi = require('joi');
const { omit } = require('ramda');
const { validate, validationError } = require('../validation');
const { getConfig } = require('../../../../config');

const config = getConfig(process.env.NODE_ENV);

test('Validation Middleware', (tape) => {
  [
    {
      name: 'Successful validation | request body',
      schema: {
        body: {
          foo: Joi.string()
            .min(1)
            .max(4)
            .required(),
          bar: Joi.number().positive(),
        },
      },
      body: { foo: 'hi', bar: '1' },
      assertions: [
        (req, res, error, t) => t.notOk(error, 'Validation was successful'),
        (req, res, error, t) =>
          t.equals(req.body.bar, 1, 'Validation performed casting'),
      ],
    },

    {
      name: 'Unsuccessful validation | request body | missing parameter',
      schema: {
        body: {
          foo: Joi.string()
            .min(1)
            .max(4)
            .required(),
          bar: Joi.number().positive(),
        },
      },
      body: { bar: '1' },
      assertions: [
        (req, res, error, t) => t.ok(error, 'Validation was unsuccessful'),
        (req, res, error, t) =>
          t.equal(
            error.message,
            'child "foo" fails because ["foo" is required]',
            'Validation message passed back'
          ),
      ],
    },

    {
      name: 'Successful validation | request params',
      schema: {
        params: {
          bar: Joi.number().positive(),
        },
      },
      body: { foo: [] },
      params: { bar: '1' },
      assertions: [
        (req, res, error, t) => t.notOk(error, 'Validation was successful'),
        (req, res, error, t) =>
          t.equals(req.params.bar, 1, 'Validation performed casting'),
        (req, res, error, t) =>
          t.deepEquals(req.body.foo, [], 'Unvalidated body params permitted'),
      ],
    },

    {
      name: 'Unsuccessful validation | request params | out of range',
      schema: {
        params: {
          bar: Joi.number().positive(),
        },
      },
      body: { foo: [] },
      params: { bar: '-1' },
      assertions: [
        (req, res, error, t) => t.ok(error, 'Validation was unsuccessful'),
        (req, res, error, t) =>
          t.equals(
            error.message,
            'child "bar" fails because ["bar" must be a positive number]',
            'Validation message passed back'
          ),
        (req, res, error, t) =>
          t.deepEquals(req.body.foo, [], 'Unvalidated body params permitted'),
      ],
    },

    {
      name: 'Successful validation | request query & body',
      schema: {
        query: {
          bar: Joi.number().positive(),
        },
        body: {
          foo: Joi.array().items(Joi.number()),
        },
      },
      body: { foo: [1, '2', 3] },
      query: { bar: '1' },
      assertions: [
        (req, res, error, t) => t.notOk(error, 'Validation was successful'),
        (req, res, error, t) =>
          t.equals(req.query.bar, 1, 'Validation performed casting'),
        (req, res, error, t) =>
          t.deepEquals(req.body.foo, [1, 2, 3], 'Validation performed casting'),
      ],
    },

    {
      name: 'Unsuccessful validation | request query & body | malformed body',
      schema: {
        query: {
          bar: Joi.number().positive(),
        },
        body: {
          foo: Joi.array().items(Joi.number()),
        },
      },
      body: { foo: [1, 2, {}] },
      query: { bar: '1' },
      assertions: [
        (req, res, error, t) => t.ok(error, 'Validation was unsuccessful'),
        (req, res, error, t) =>
          t.equals(
            error.message,
            'child "foo" fails because ["foo" at position 2 fails because ["2" must be a number]]',
            'Validation message passed back'
          ),
      ],
    },
  ].forEach((fixture) => {
    tape.test(`validate | ${fixture.name}`, (t) => {
      const middleware = validate(fixture.schema);
      const res = {};
      const req = {
        app: { get: () => config },
        params: fixture.params,
        query: fixture.query,
        body: fixture.body,
      };

      middleware(req, res, (error) => {
        fixture.assertions.forEach((assertion) => {
          assertion(req, res, error, t);
        });
        t.end();
      });
    });
  });

  tape.test('validationError | Non-joi error', (t) => {
    const req = {};
    const error = new Error('not a Joi error');
    const res = {
      status: () => { },
      send: () => { },
    };

    validationError(error, req, res, (err) => {
      t.equals(error, err, 'Non-Joi error passed onto next error-middleware');
      t.end();
    });
  });

  tape.test('validationError | Joi error', (t) => {
    const details = [
      { message: 'foo', context: { key: 'foo' } },
      { message: 'boo', context: { key: 'foo' } },
      { message: 'bar', context: { key: 'bar' } },
    ];
    const app = { get: () => 'test' };
    const req = { app };
    const error = { isJoi: true, details };
    const res = {
      status: (code) => {
        t.equal(code, 400, 'Set Bad Request status code');
        return res;
      },
      send: (payload) => {
        t.deepEquals(
          payload,
          {
            result: null,
            error: omit(['details', '_object'], error),
            validation: { foo: ['foo', 'boo'], bar: ['bar'] },
          },
          'Send validation errors back in payload'
        );
        t.end();
        return res;
      },
    };

    validationError(error, req, res, t.end);
  });
});
