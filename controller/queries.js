

// Users Queries
const getUserData="SELECT * FROM user_table";
const getUserById="SELECT * FROM user_table where user_id=$1"
const registerUser="INSERT INTO user_table (username, email, password) VALUES ($1, $2, $3)";
const emailIsExist="SELECT * FROM user_table WHERE email = $1";


// Folder Queries
const folderById="SELECT * FROM folderdata WHERE folder_name = $1 AND user_id = $2";
const postFolders="INSERT INTO folderdata (folder_name, user_id) VALUES ($1, $2)";
const allfolder="SELECT * FROM folderdata";
const getsubFolder="SELECT * FROM folderdata WHERE folder_name = $1 AND parent_folder_id = $2";
const postSubfolder="INSERT INTO folderdata (folder_name, user_id, parent_folder_id) VALUES ($1, $2, $3)";
const getFolderCheck="SELECT * FROM folderdata WHERE folder_id = $1 AND user_id = $2"

// metadata
const metaData="INSERT INTO filemetadata (file_name, file_size, upload_date, user_id, folder_id) VALUES ($1, $2, $3, $4, $5)";
const updateFile="UPDATE filemetadata SET file_name = $1 WHERE file_id = $2";
const filecheck="SELECT * FROM filemetadata WHERE file_id = $1 AND user_id = $2";
const updateFolder="UPDATE filemetadata SET folder_id = $1 WHERE file_id = $2";
const deleteFile="DELETE FROM filemetadata WHERE file_id = $1";

module.exports={
    getUserData,
    getUserById,
    registerUser,
    emailIsExist,
    folderById,
    postFolders,
    allfolder,
    getsubFolder,
    postSubfolder,
    getFolderCheck,
    metaData,
    updateFile,
    filecheck,
    updateFolder,
    deleteFile
};