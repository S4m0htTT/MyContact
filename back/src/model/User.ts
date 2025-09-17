import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;

    lastLogin: Date;

    createdAt?: Date;
    updatedAt?: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    email: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        required: false,
        default: null
    }

}, {
    timestamps: true,
    versionKey: false,
});

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(saltRounds, function(err: mongoose.CallbackError | undefined, salt: any) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err: mongoose.CallbackError | undefined, hash: string) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err : any) {
        throw err;
    }
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
