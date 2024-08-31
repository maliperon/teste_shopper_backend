import express, { Request, Response, Router } from 'express';
import path from 'path';
import MeasureController from '../controllers/MeasureController';

class MeasureRoutes {
  private router: Router;
  private controller: MeasureController;

  constructor() {
    this.router = express.Router();
    this.controller = new MeasureController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', (req: Request, res: Response) => {res.json({ oi: 'aplicação rodando :)' });});

    this.router.post('/upload', this.controller.upload.bind(this.controller));

    this.router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
    
    this.router.patch('/confirm', this.controller.confirm.bind(this.controller));

    this.router.get('/:customer_code/list', this.controller.listByCustomer.bind(this.controller));
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new MeasureRoutes().getRouter();
