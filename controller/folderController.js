const queries=require('./queries');
const pool=require('../DB/connectDB');
// const AWS = require('aws-sdk');


// const s3 = new AWS.S3({
//   accessKeyId: 'your_aws_access_key_id',
//   secretAccessKey: 'your_aws_secret_access_key',
// });

async function checkSubfolderPermission(userId, parentFolderId) {
    const permissionCheck = await pool.query(queries.getFolderCheck, [parentFolderId, userId]);
    return permissionCheck.rows.length > 0;
}

async function folderExist(userId,folderName){
    const folderExists = await pool.query(queries.folderById, [folderName, userId]);
    const userExists=await pool.query(queries.getUserById,[userId]);
    if (userExists.rows.length<=0 || folderExists.rows.length > 0) {
        return true;
    }
    return false;
}


const getFolders=async (req,res)=>{
    try{
        const folderData=await pool.query(queries.allfolder);
        if(!folderData){
            return res.status(400).json({error:"Folder is not there"});
        }
        res.status(200).json(folderData.rows);
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
}


const postFolder=async (req, res) => {
    try {
      const userId=parseInt(req.params.userId);
      const {folderName} = req.body;
      if (!folderName) {
        return res.status(400).json({ error: 'Folder name are required.' });
      }
      if (folderExist(userId,folderName)) {
        return res.status(400).json({ error: 'Folder name must be unique for the this folder or User Does not Exist' });
      }
      await pool.query(queries.postFolders, [folderName, userId]);
      res.status(201).json({ message: 'Folder created successfully.' });
    } catch (error) {
      console.error('Error creating folder:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const postSubfolder=async(req,res)=>{
    try {
        const parentFolderId=req.params.parentId;
        const { subfolderName } = req.body;
        const userId=req.userId;
        console.log(userId);
        if (!subfolderName) {
          return res.status(400).json({ error: 'Subfolder name are required.' });
        }
        const hasPermission = await checkSubfolderPermission(userId, parentFolderId);
        if (!hasPermission) {
          return res.status(403).json({ error: 'Permission denied. User does not have the required permission for the parent folder.' });
        }
        const subfolderExists = await pool.query(queries.getsubFolder, [subfolderName, parentFolderId]);
        if (subfolderExists.rows.length > 0) {
          return res.status(400).json({ error: 'Subfolder name must be unique for the parent folder.' });
        }
        await pool.query(queries.postSubfolder, [subfolderName, userId, parentFolderId]);   
        res.status(201).json({ message: 'Subfolder created successfully.' });
      } catch (error) {
        console.error('Error creating subfolder:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  }


  const fileSubmit=async(req,res)=>{
    try {
      const userId=req.userId;
      const {file,folderId} = req.file;
      if (!folderId || !userId || !file) {
        return res.status(400).json({ error: 'Folder ID, user ID, and file are required.' });
      }
      const permissionCheck = await pool.query(queries.getFolderCheck, [folderId, userId]);
  
      if (permissionCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Permission denied. User does not have the required permission for the folder.' });
      }
  
      // Upload the file to AWS S3
      const params = {
        Bucket: 'your_s3_bucket_name',
        Key: file.originalname,
        Body: file.buffer,
      };
  
      const s3UploadResponse = await s3.upload(params).promise();
  
      // Record file metadata in the database
      const fileName = file.originalname;
      const fileSize = file.size;
      const uploadDate = new Date();
      
      await pool.query(queries.metaData,
        [fileName, fileSize, uploadDate, userId, folderId, s3UploadResponse.Key]);
  
      res.status(201).json({ message: 'File uploaded successfully.' });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }



  const fileRename=async(req,res)=>{
    try {
      const userId=req.userId;
      const { fileId, newFileName } = req.body;
      if (!fileId || !newFileName || !userId) {
        return res.status(400).json({ error: 'File ID, new file name, and user ID are required.' });
      }
      const fileExist = await pool.query(queries.filecheck, [fileId, userId]);
      if (fileExist.rows.length === 0) {
        return res.status(403).json({ error: 'File does not exist' });
      }
      await pool.query(queries.updateFile, [newFileName, fileId]);
      res.status(200).json({ message: 'File renamed successfully.' });
    } catch (error) {
      console.error('Error renaming file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  const moveFile=async(req,res)=>{
    try {
      const userId=req.userId;
      const { fileId, newFolderId } = req.body;
  
      if (!fileId || !newFolderId || !userId) {
        return res.status(400).json({ error: 'File ID, new folder ID, and user ID are required.' });
      }
  
      const fileExist = await pool.query(queries.filecheck, [fileId, userId]);
      if (fileExist.rows.length === 0) {
        return res.status(403).json({ error: 'File does not exist' });
      }
  
      await pool.query(queries.updateFolder, [newFolderId, fileId]);
      res.status(200).json({ message: 'File moved successfully.' });
    } catch (error) {
      console.error('Error moving file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  const deleteFile=async(req,res)=>{
    try {
      const userId=req.userId;
      const { fileId } = req.body;
  
      if (!fileId || !userId) {
        return res.status(400).json({ error: 'File ID and user ID are required.' });
      }
      const fileExist = await pool.query(queries.filecheck, [fileId, userId]);
      if (fileExist.rows.length === 0) {
        return res.status(403).json({ error: 'Permission denied. User does not have the required permission for the file.' });
      }
      const fileKey = fileExist.rows[0].s3_object_key;
      await s3.deleteObject({ Bucket: 'your_s3_bucket_name', Key: fileKey }).promise();
      await pool.query(queries.deleteFile, [fileId]);
      res.status(200).json({ message: 'File deleted successfully.' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }





  module.exports={getFolders,postFolder,postSubfolder,fileSubmit,fileRename,moveFile,deleteFile};