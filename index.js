import path from "path";
import express, { urlencoded, json } from "express";
import cors from "cors";
import { VARS } from "./modules/vars.js";
import { init as initDB, Counter } from "./db.js";
import { globSync } from 'glob';
import { Logger } from './modules/logger.js';
const { logger } = Logger('boot');
import { httpErrorHandler, httpNotFoundHandler } from './modules/http-manager.js';
import { utilityService } from "./modules/services/utility.js";

const app = express();
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();

  const list = globSync(path.resolve('routers/**/*.js'));

  let sequence = 0;
  for(const i in list) {
    sequence++;
    const filePath = list[i];
    logger.log(`[${sequence}/${list.length}] Router: ${filePath}`);
    /**
     * @type {{ publicPath: string, publicRouter: express.Router, privatePath: string?, privateRouter: express.Router? }} router Router
     */
    const { publicPath, publicRouter, privatePath, privateRouter } = await import(filePath);
  
    if(publicRouter && publicPath) {
      const prefixPublic = `${VARS.APP_CONTEXT}${publicPath}`;
      logger.info(`Public: ${prefixPublic}`);
      app.use(prefixPublic, publicRouter);
    }
    if (privateRouter && privatePath) {
      const prefixPrivate = `${VARS.APP_CONTEXT}${privatePath}`;
      logger.info(`Secured: ${prefixPrivate}`);
      app.use(prefixPrivate, sessionService.authenticate(), privateRouter);
    }
  
    if(sequence === list.length) {
      logger.debug('### COMPLETED DYNAMIC IMPORT ###');
      app.use(httpErrorHandler);
    }
  }

  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
