import crypto from 'crypto';

class UtilityService {

  /**
   * Sign to get signature
   * @param {string} str String
   * @param {import('crypto').BinaryLike} secret Secret
   * @returns {string} Returns signed string
   */
  sign(str, secret, algorithm = 'sha256') {
    return crypto
      .createHmac(algorithm, secret)
      .update(str, 'utf8')
      .digest('hex');
  }

  /**
   * Hash to get hashed string
   * @param {string} str String
   * @returns {string} Returns hashed string
   */
  hash(str, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(str).digest('hex');
  }

}

export const utilityService = new UtilityService();
