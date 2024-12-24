import mongoose from "mongoose";

const userSchema= mongoose.Schema({
    name: {
        type: String,
    },
    userBalance:{
        type: String
    }

});

export const User = mongoose.model('User',userSchema);