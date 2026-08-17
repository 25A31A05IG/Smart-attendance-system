const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==========================================
// Upload folder
// ==========================================

const uploadDir = "uploads";

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ==========================================
// Storage
// ==========================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {

    const extension =
      path.extname(file.originalname);

    const filename =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9) +
      extension;

    cb(null, filename);
  },

});

// ==========================================
// File Filter
// ==========================================

const fileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

// ==========================================
// Multer
// ==========================================

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;
