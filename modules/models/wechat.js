
export class WeChatPayloadPhone {
  /** @type {number} */
  errcode;
  /** @type {string} */
  errmsg;
  /** @type {{ phoneNumber: string, countryCode: string, watermark: { timestamp: number, appid: string } }} */
  phone_info;
}

export class WeChatPayloadOpenId {
  /** @type {string} */
  session_key;
  /** @type {string} */
  unionid;
  /** @type {string} */
  errmsg;
  /** @type {string} */
  openid;
  /** @type {number} */
  errcode;
}

export class WeChatPayloadToken {
  /** @type {string} */
  access_token;
  /** @type {number} */
  expires_in;
}
