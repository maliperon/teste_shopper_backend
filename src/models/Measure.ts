import mongoose, { Schema, Document } from 'mongoose';

export interface IMeasure extends Document {
  customer_code: string;
  measure_uuid: string;
  measure_type: 'WATER' | 'GAS';
  measure_value: number;
  measure_datetime: Date;
  has_confirmed: boolean;
  image_url: string
}

const MeasureSchema: Schema = new Schema({
    customer_code: { type: String, required: true },
    measure_uuid: { type: String, required: true, unique: true },
    measure_type: { type: String, required: true, enum: ['WATER', 'GAS'] },
    measure_datetime: { type: Date, required: true },
    measure_value: { type: Number, required: true },
    has_confirmed: { type: Boolean, default: false },
    image_url: { type: String, required: true }
  });

const MeasureModel = mongoose.model<IMeasure>('Measure', MeasureSchema);

export default MeasureModel;
