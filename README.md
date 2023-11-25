# File Manager Application

This is a File Manager application that allows users to securely manage folders and files. The application is built using Node.js, Express, PostgreSQL for data storage, and AWS S3 for file storage.

## Setup

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/file-manager-app.git

2. Install dependency

   cd file-manager-app
   npm install

### Database Schema


### Userdata Table

user_id (Primary Key, Serial): Unique identifier for each user.
username (VARCHAR, NOT NULL): User's username.
email (VARCHAR, NOT NULL): User's email address.
password (VARCHAR, NOT NULL): User's hashed password.

### FolderData Table

Folderdata Table
folder_id (Primary Key, Serial): Unique identifier for each folder.
folder_name (VARCHAR, NOT NULL): Name of the folder.
user_id (INT, NOT NULL, Foreign Key): References the user_id in the Userdata table.
parent_folder_id (INT, Foreign Key): References the folder_id in the Folderdata table. Indicates the parent folder.
created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp indicating when the folder was created.

### Filemetadata Table

file_id (Primary Key, Serial): Unique identifier for each file.
filename (VARCHAR, NOT NULL): Name of the file.
user_id (INT, NOT NULL, Foreign Key): References the user_id in the Userdata table.
upload_date (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp indicating when the file was uploaded.
folderId (INT, Foreign Key): References the folder_id in the Folderdata table. Indicates the file folder.


### API Endpoints

### User Registration and Login

### Register a new user.

POST /api/v1/user/register
Request body: { "username": "your_username", "email": "your_email@example.com", "password": "your_password" }



### Log in an existing user.

POST /api/v1/user/login
Request body: { "email": "your_email@example.com", "password": "your_password" }


### Create Folder API

1. Create a new folder.

   POST /api/v1/folder/:userId
   Request body: { "folderName": "Folder Name" }

2. Create Subfolder API

   POST /api/v1/folder/:parentId/subfolder
   Request body: { "subfolderName": "Subfolder Name", "parentFolderId": 1 }

3. Upload Files API

   POST /api/v1/folder/uploads
   Request body: FormData with file field.
   
4. Rename a file.
   
   PUT /api/v1/folder/file/rename
   Request body: { "newFilename": "New File Name" }

5. Move a file to a different folder.

   PUT /api/v1/folder/file/move

6. Delete a file.

   DELETE /api/v1/folder/file/delete


