const express = require('express'); // web server
const sharp = require('sharp'); 
const path = require('path');
const fs = require('fs');

const app = express();

const WIDTH = 800;
const HEIGHT = 600;
const DPI = 300; 

const inputDir = path.join(__dirname, 'input_images');
const outputDir = path.join(__dirname, 'resized_images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

app.get('/', async (req, res) => {
    try {
        const files = fs.readdirSync(inputDir).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
        
        for (const file of files) {
            const inputFilePath = path.join(inputDir, file);
            const outputFilePath = path.join(outputDir, `${Date.now()}-${file}`);

            await sharp(inputFilePath)
                .resize(WIDTH, HEIGHT)
                .withMetadata({ density: DPI }) //  DPI
                .toFile(outputFilePath);
        }

        // res.send(`
        //     <h2>Images resized</h2>
        //     ${files.map(file => `<img src="/resized_images/${Date.now()}-${file}" style="width:100%;max-width:${WIDTH}px;"><br>`).join('')}
        // `);
        res.send(`
        <h2>Images resized</h2>
    `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error resizing images.');
    }
});

// Serve the resized images
app.use('/resized_images', express.static(outputDir));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
