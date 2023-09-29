import { Schema, model } from "mongoose";

export interface IScanFrequencyScreen {
    id: Schema.Types.ObjectId;
    scanFrequency: string;
}

const schemaScanFrequencyScreen = new Schema<IScanFrequencyScreen>(
    {
        scanFrequency: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

const ScanFrequencyScreenModel = model<IScanFrequencyScreen>(
    "ScanFrequencyScreen",
    schemaScanFrequencyScreen
);

export default ScanFrequencyScreenModel;
