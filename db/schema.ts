import mongoose from "mongoose";

const PowercutSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

export default mongoose.model('powercuts', PowercutSchema);