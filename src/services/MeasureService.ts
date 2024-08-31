import { v4 as uuidv4 } from 'uuid';

import isValidBase64 from '../utils/validator';
import monthBounds from '../utils/monthBounds';

import MeasureModel from '../models/Measure';
import ImageService from './ImageService';

class MeasureService {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  public async uploadMeasure(
    image: string, customer_code: string, measure_datetime: string, measure_type: string
  ): Promise<{ image_url: string; measure_value: number; measure_uuid: string }> {
    if (!image || !isValidBase64(image)) {
      throw new Error('INVALID_DATA');
    }

    if (!customer_code || typeof customer_code !== 'string' || 
        !measure_datetime || isNaN(new Date(measure_datetime).getTime()) || 
        !measure_type || (measure_type !== 'GAS' && measure_type !== 'WATER')) {
      throw new Error('INVALID_DATA');
    }

    const { firstDay, lastDay } = monthBounds(new Date(measure_datetime));

    const existingMeasure = await MeasureModel.findOne({
      customer_code,
      measure_type,
      measure_datetime: {
        $gte: firstDay,
        $lt: lastDay
      }
    });

    if (existingMeasure) {
      throw new Error('DOUBLE_REPORT');
    }

    const value = await this.imageService.processImage(image);
    const guid = uuidv4();
    const fileName = `${guid}.png`; 
    const imageUrl = this.imageService.saveImage(image, fileName);

    const newMeasure = new MeasureModel({
      customer_code: customer_code,
      measure_uuid: guid,
      measure_type: measure_type,
      measure_value: value,
      measure_datetime: new Date(measure_datetime),
      has_confirmed: false,
      image_url: imageUrl
    });

    await newMeasure.save();

    return {
      image_url: imageUrl,
      measure_value: value,
      measure_uuid: guid
    };
  }

  public async confirmMeasure(measure_uuid: string, confirmed_value?: number | null): Promise<{ success: boolean }> {
    if (!measure_uuid || typeof measure_uuid !== 'string' || 
        (typeof confirmed_value !== 'number' && confirmed_value !== null)) {
      throw new Error('INVALID_DATA');
    }

    const existingMeasure = await MeasureModel.findOne({ measure_uuid });

    if (!existingMeasure) {
      throw new Error('MEASURE_NOT_FOUND');
    }

    if (existingMeasure.has_confirmed) {
      throw new Error('CONFIRMATION_DUPLICATE');
    }

    if (typeof confirmed_value == 'number') {
      existingMeasure.measure_value = confirmed_value;
    } 
    
    existingMeasure.has_confirmed = true;

    await existingMeasure.save();

    return { success: true };
  }

  public async listCustomerMeasures(
    customer_code: string, measure_type?: string | null
  ): Promise<{ customer_code: string; measures: any[] }> {
    if (!customer_code || typeof customer_code !== 'string' || 
        (measure_type !== null && typeof measure_type !== 'string')
      ) {
      throw new Error('INVALID_DATA');
    }

    const query: any = { customer_code };
      
    if (measure_type) {
      query.measure_type = { $regex: new RegExp(measure_type, 'i') };
    }

    const measures = await MeasureModel.find(query).select(
      'measure_uuid measure_datetime measure_type has_confirmed image_url'
    );

    if (measures.length == 0) {
      throw new Error('MEASURES_NOT_FOUND');
    }

    const formattedMeasures = measures.map(measure => ({
      measure_uuid: measure.measure_uuid,
      measure_datetime: measure.measure_datetime,
      measure_type: measure.measure_type,
      has_confirmed: measure.has_confirmed,
      image_url: measure.image_url,
    }));

    return {
      customer_code,
      measures: formattedMeasures,
    };
  }
}

export default MeasureService;