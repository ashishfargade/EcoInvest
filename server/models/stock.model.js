import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        
    },
    companyName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    industry: {
        type: String,
        trim: true,
    },
    sector: {
        type: String,
        trim: true
    },
    description:{
        type: String,
    },
    website: {
        type: String,
        trim: true,
    },
    exchange: {
        type: String,
        trim: true,
    },
    // OTHER STUFF
})

export const Stock = mongoose.model("Stock", stockSchema);