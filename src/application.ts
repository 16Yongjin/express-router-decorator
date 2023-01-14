import express, { Application as ExApplication, Handler } from 'express';
import { controllers } from './controllers';
import { IRouter } from './utils/handlers.decorator';
import { MetadataKeys } from './utils/metadata.key';

class Application {
  private readonly _instance: ExApplication;

  get instance(): ExApplication {
    return this._instance;
  }

  constructor() {
    this._instance = express();
    this._instance.use(express.json());
    this.registerRouters();
  }

  private registerRouters() {
    this._instance.get('/', (req, res) => {
      res.json({ message: 'Hello world!' });
    });

    const info: Array<{ api: string; handler: string }> = [];

    controllers.forEach((controllerClass) => {
      console.log('== initialize controllerInstance');
      const controllerInstance: { [handleName: string]: Handler } =
        new controllerClass() as any;

      const basePath: string = Reflect.getMetadata(
        MetadataKeys.BASE_PATH,
        controllerClass
      );

      const routers: IRouter[] = Reflect.getMetadata(
        MetadataKeys.ROUTERS,
        controllerClass
      );

      const exRouter = express.Router();

      routers.forEach(({ method, path, handlerName }) => {
        exRouter[method](
          path,
          controllerInstance[String(handlerName)].bind(controllerInstance)
        );

        info.push({
          api: `${method.toLocaleUpperCase()} ${basePath + path}`,
          handler: `${controllerClass.name}.${String(handlerName)}`,
        });
      });

      this._instance.use(basePath, exRouter);
    });

    console.table(info);
  }
}

export default new Application();
