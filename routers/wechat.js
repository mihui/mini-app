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
 * API endpoint
 */
publicRouter.get('/login', async (req, res, next) => {
  const { code = '' } = req.query;
  try {
    const token = await wechatService.obtainAccessToken(code);
    logger.debug('token------->', token);
    const openId = await wechatService.obtainOpenId(code);
    logger.debug('openId------->', openId);
    res.send(httpNormal(openId));
  }
  catch(error) {
    next(error);
  }
});

/**
 * API endpoint
 */
publicRouter.get('/telephone', async (req, res, next) => {
  const { code = '' } = req.query;
  try {
    const token = await wechatService.obtainAccessToken(code);
    logger.debug('token------->', token);
    const openId = await wechatService.obtainOpenId(code);
    logger.debug('openId------->', openId);
    const telephone = await wechatService.obtainTelephone(token.access_token, code, openId.openid);
    logger.debug('telephone------->', telephone);
    res.send(httpNormal({ telephone }));
  }
  catch(error) {
    next(error);
  }
});
