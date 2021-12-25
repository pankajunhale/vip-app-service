const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const process = require('process');

// Printing present working Directory
console.log("Present working directory: " + process.cwd());
process.chdir(process.cwd()+ '\\assets\\resources\\');
let storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const myDirectoryPath = `${process.cwd()}`;
    console.debug(myDirectoryPath)
    cb(null, myDirectoryPath);
  },
  filename: (req: any, file: any, cb: any) => {
    console.debug(file);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

export const uploadFileMiddleware = util.promisify(uploadFile);