import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: '',
    }
})

export default mongoose.model('News', newsSchema);