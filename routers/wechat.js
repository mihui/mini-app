import { Router } from 'express';
import { httpError, httpCodes, httpMessages, httpNormal } from '../modules/http-manager.js';
import { Logger } from '../modules/logger.js';

import { wechatService } from '../modules/services/wechat.js';

const { logger } = Logger('studio');

export const publicRouter = Router();
export const publicPath = '/api/wechat';

/**
 * API endpoint
 */
publicRouter.get('/', async (req, res, next) => {
  return res.send(httpNormal({ status: httpCodes.OK, message: 'WeChat API' }));
});

/**
 * WeChat login
 */
publicRouter.get('/login', async (req, res, next) => {
  /** @type {{ code: string }} */
  const { code = '', telephone = '' } = req.query;
  try {
    const token = await wechatService.obtainAccessToken();
    logger.debug('token------->', token);
    const openId = await wechatService.obtainOpenId(code);
    logger.debug('openId------->', openId);

    let extra = {};
    if(telephone) {
      extra = await wechatService.obtainTelephone(token.access_token, telephone, openId.openid);
      logger.debug('telephone------->', extra);
    }

    res.send(httpNormal({ user: openId, extra }));
  }
  catch(error) {
    next(error);
  }
});


/**
 * Get WeChat user profile
 */
publicRouter.get('/user', async (req, res, next) => {
  /** @type {{ code: string }} */
  const { code = '' } = req.query;
  /** @type {{ sessionKey: string }} */
  let { sessionKey = '' } = req.query;
  try {
    const token = await wechatService.obtainAccessToken();
    logger.debug('token------->', token);
    if(sessionKey === '') {
      const openId = await wechatService.obtainOpenId(code);
      sessionKey = openId.session_key;
    }
    logger.debug('openId------->', openId);
    const user = await wechatService.fetchUser(openId, token.access_token, sessionKey);
    logger.debug('user------->', user);
    res.send(httpNormal({ user }));
  }
  catch(error) {
    next(error);
  }
});
