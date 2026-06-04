import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a gallery item title'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['residential', 'commercial', 'interior', 'steel'],
        },
        url: {
            type: String,
            required: [true, 'Please add an image URL'],
        },
    },
    {
        timestamps: true,
    }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
