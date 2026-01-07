import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name: {
            type:String,
            required: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        }
    },
    {timestamps: true}
);

// Transform the JSON output
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password; 
        delete ret.__v;    
        return ret;
    }
});

const User = mongoose.model("User", userSchema);

export default User;