const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";

// Create uploads folder
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage =
  multer.diskStorage({

    destination: function (
      req,
      file,
      cb
    ) {
      cb(
        null,
        uploadDir
      );
    },

    filename: function (
      req,
      file,
      cb
    ) {

      const extension =
        path.extname(
          file.originalname
        );

      const filename =
        Date.now() +
        "-" +
        Math.round(
          Math.random() * 1e9
        ) +
        extension;

      cb(
        null,
        filename
      );
    },

  });

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

const upload =
  multer({

    storage,

    fileFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },

  });

module.exports = upload;
