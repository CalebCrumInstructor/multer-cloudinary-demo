const express = require('express');
// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

const upload = require('./lib/multer');
const cloudinary = require('./lib/cloudinary');

// Set up body parsing, static, and route middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/photo', upload.single('file'), async (req, res) => {
  console.log(req.file)
  try {
    const cloudImgData = await cloudinary.uploader.upload('./uploads/' + req.file.filename, {
      upload_preset: 'My Preset Here'
    })

    const imgInfoObj = {
      public_id: cloudImgData.public_id,
      filename: cloudImgData.original_filename,
      url: cloudImgData.url
    }

    console.log(imgInfoObj);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
