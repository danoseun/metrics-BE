import { Document, Model } from 'mongoose';

export interface Metric extends Document {
    name: string;
    value: number;
}