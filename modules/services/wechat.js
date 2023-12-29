import axios from 'axios';
import { httpCodes, httpError, httpMessages } from '../http-manager';
import { VARS } from '../vars';

import { WeChatPayloadPhone, WeChatPayloadOpenId, WeChatPayloadToken } from '../models/wechat.js';

class WeChatService {

  /**
   * Get access token
   * @returns {Promise<WeChatPayloadToken>} Returns token
   */
  async obtainAccessToken() {
    const requestUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${VARS.APP_ID}&secret=${VARS.APP_SECRET}`;
    try {
      /** @type {import('axios').AxiosResponse} */
      const response = await axios(requestUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      /** @type {WeChatPayloadToken} */
      const payload = response.data;
      return payload;
    }
    catch(error) {
      throw httpError(httpCodes.BAD_REQUEST, httpMessages.BAD_REQUEST, error);
    }
  }

  /**
   * Get telephone data
   * @param {string} accessToken Access token
   * @param {string} code Login code
   * @param {string} openid Open ID
   * @returns {Promise<WeChatPayloadPhone>} Returns data payload of the phone
   */
  async obtainTelephone(accessToken, code, openid) {
    const requestUrl = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`;
    try {
      /** @type {import('axios').AxiosResponse} */
      const response = await axios(requestUrl, {
        method: 'POST',
        data: {
          code, openid
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      /** @type {WeChatPayloadPhone} */
      const payload = response.data;
      return payload;
    }
    catch(error) {
      throw httpError(httpCodes.BAD_REQUEST, httpMessages.BAD_REQUEST, error);
    }
  }

  /**
   * Get Open ID data
   * @param {string} code Login code
   * @returns {Promise<WeChatPayloadOpenId>} Returns data
   */
  async obtainOpenId(code) {
    const requestUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${VARS.APP_ID}&secret=${VARS.APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
    try {
      /** @type {import('axios').AxiosResponse} */
      const response = await axios(requestUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      /** @type {WeChatPayloadOpenId} */
      const payload = response.data;
      return payload;
    }
    catch(error) {
      throw httpError(httpCodes.BAD_REQUEST, httpMessages.BAD_REQUEST, error);
    }
  }

}

export const wechatService = new WeChatService();
