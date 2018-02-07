import expect from 'expect';
import User from '../../support/User';

describe('Tokenable', function() {
  let user, token;

  before(async function() {
    user = await User.query().insert({
      name: 'Foo Bar',
      password: 'foobar',
      email: 'foo@bar.com'
    });

    token = await user.generateJWT();
  });

  describe('.generateJWT', function() {
    it('generates a token with expiration', async function() {
      expect(token).toBeDefined();
      expect(token).not.toBe(null);
    });
  });

  describe('.decodeJWT', function() {
    it('verifies the given token against the user', async function() {
      const decoded = await user.decodeJWT(token);
      expect(decoded.id).toEqual(user.id);
      expect(decoded.email).toEqual(user.email);
    });
  });
});