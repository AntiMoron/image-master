const fs = require('fs');
const path = require('path');
const piexif = require('piexifjs');

const supportedExtensions = ['.webp', '.png', '.svg', '.jpg', '.jpeg'];

const removeMetadata = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  if (!supportedExtensions.includes(extension)) {
    console.log(`Skipping unsupported file type: ${filePath}`);
    return;
  }

  try {
    let data = fs.readFileSync(filePath).toString('binary');
    let newData = piexif.remove(data);
    fs.writeFileSync(filePath, newData, 'binary');
    console.log(`Removed metadata from: ${filePath}`);
  } catch (error) {
    // Piexifjs might fail on non-jpeg files or files with no exif data.
    // For now, we will just log the error and continue.
    if (error.message.includes("Given data is not JPEG.")) {
        console.log(`No EXIF data to remove or not a JPEG: ${filePath}`);
    } else {
        console.error(`Error processing ${filePath}:`, error);
    }
  }
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node remove-metadata.js <file1> <file2> ...');
    return;
  }

  for (const file of args) {
    removeMetadata(file);
  }
};

main();
