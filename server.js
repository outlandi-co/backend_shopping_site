const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.json({ fileUrl: `uploads/${req.file.filename}` });
});

app.get('/api/products', (req, res) => {
    const products = [
        { id: 1, name: 'Shirt', price: 20, image: '/path/to/image1.jpg' },
        { id: 2, name: 'Hoodie', price: 35, image: '/path/to/image2.jpg' },
    ];
    res.json(products);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
