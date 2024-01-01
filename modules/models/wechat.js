export class WeChatPayloadBase {
  /** @type {number} */
  errcode;
  /** @type {string} */
  errmsg;
};

export class WeChatPayloadPhone extends WeChatPayloadBase {
  /** @type {{ phoneNumber: string, countryCode: string, watermark: { timestamp: number, appid: string } }} */
  phone_info;
}

export class WeChatPayloadOpenId extends WeChatPayloadBase {
  /** @type {string} */
  session_key;
  /** @type {string} */
  unionid;
  /** @type {string} */
  openid;
};

export class WeChatPayloadToken {
  /** @type {string} */
  access_token;
  /** @type {number} */
  expires_in;
};

export class WeChatPayloadEncryptedKey extends WeChatPayloadBase {
  /** @type {Array<{ encrypt_key: string, version: string, expire_in: number, iv: string, create_time: number }>} */
  key_info_list;
};
