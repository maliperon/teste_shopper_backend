import { Request, Response } from 'express';
import { handleErrorResponse } from '../utils/error';
import MeasureService from '../services/MeasureService';

class MeasureController {
  private measureService: MeasureService;

  constructor() {
    this.measureService = new MeasureService();
  }

  public async upload(req: Request, res: Response) {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    try {
      const result = await this.measureService.uploadMeasure(image, customer_code, measure_datetime, measure_type);
      res.status(200).json(result);
    } catch (error: unknown) {
      console.error(error);
      const { statusCode, errorCode, errorDescription } = handleErrorResponse(error, 'Error processing the measurement');
      res.status(statusCode).json({ error_code: errorCode, error_description: errorDescription });
    }
  }

  public async confirm(req: Request, res: Response) {
    const { measure_uuid, confirmed_value } = req.body;

    try {
      const result = await this.measureService.confirmMeasure(measure_uuid, confirmed_value);
      res.status(200).json(result);
    } catch (error: unknown) {
      console.error(error);
      const { statusCode, errorCode, errorDescription } = handleErrorResponse(error, 'Error processing the confirmation');
      res.status(statusCode).json({ error_code: errorCode, error_description: errorDescription });
    }
  }

  public async listByCustomer(req: Request, res: Response) {
    const { customer_code } = req.params; 
    const { measure_type } = req.query; 

    try {
      const result = await this.measureService.listCustomerMeasures(customer_code, measure_type as string);
      res.status(200).json(result);
    } catch (error: unknown) {
      console.error(error);
      const { statusCode, errorCode, errorDescription } = handleErrorResponse(error, 'Error processing the confirmation');
      res.status(statusCode).json({ error_code: errorCode, error_description: errorDescription });
    }
  }
}

export default MeasureController;