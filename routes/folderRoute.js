const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const multer = require('multer');
const uuid=require("uuid").v4
;
const {postFolder,getFolders,postSubfolder,fileSubmit,fileRename,moveFile,deleteFile} =require('../controller/folderController');

router.route('/').get(getFolders);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    cb(null, `${uuid()}-${fileName}`);
  },
});

const upload = multer({ storage: storage });
router.route('/uploads').post(upload.single('file'),fileSubmit);
router.route('/:userId').post(postFolder);
router.route('/file/rename').post(fileRename);
router.route('/file/move').post(moveFile);
router.route('/file/delete').delete(deleteFile);

const verifyToken = (req, res, next) => {
  var prefix='Bearer';
  const token =req.headers.authorization.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Permission denied. User does not have the required permission' });
  }

  jwt.verify(token,process.env.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Permission denied. User does not have the required permission' });
    }
    req.userId = decoded.userId; // Store the user ID for later use
    next();
  });
};
router.route('/:parentId/subfolder/').post(verifyToken,postSubfolder);

module.exports=router;
