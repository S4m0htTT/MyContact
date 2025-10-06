import mongoose, {Document, Schema} from 'mongoose';

export interface IContact extends Document {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    user: mongoose.Types.ObjectId;
}

const contactSchema: Schema<IContact> = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true,
    }
},{
    timestamps: true,
    versionKey: false,
})

const Contact = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;