import { Schema, model } from "mongoose";

export interface IResolutionScreen {
    id: Schema.Types.ObjectId;
    name: string;
}

const schemaResolutionScreen = new Schema<IResolutionScreen>(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

const ResolutionScreenModel = model<IResolutionScreen>(
    "ResolutionScreen",
    schemaResolutionScreen
);

export default ResolutionScreenModel;
