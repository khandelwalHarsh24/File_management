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

1. user_id (Primary Key, Serial): Unique identifier for each user.

2. username (VARCHAR, NOT NULL): User's username.

3. email (VARCHAR, NOT NULL): User's email address.

4. password (VARCHAR, NOT NULL): User's hashed password.

### FolderData Table

1. folder_id (Primary Key, Serial): Unique identifier for each folder.

2. folder_name (VARCHAR, NOT NULL): Name of the folder.

3. user_id (INT, NOT NULL, Foreign Key): References the user_id in the Userdata table.

4. parent_folder_id (INT, Foreign Key): References the folder_id in the Folderdata table. Indicates the parent folder.

5. created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp indicating when the folder was created.

### Filemetadata Table

1. file_id (Primary Key, Serial): Unique identifier for each file.

2. filename (VARCHAR, NOT NULL): Name of the file.

3. user_id (INT, NOT NULL, Foreign Key): References the user_id in the Userdata table.

4. upload_date (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Timestamp indicating when the file was uploaded.

5. folderId (INT, Foreign Key): References the folder_id in the Folderdata table. Indicates the file folder.


### API Endpoints

### User Registration and Login

### Register a new user.

POST /api/v1/user/register


### Log in an existing user.

POST /api/v1/user/login


### Create Folder API

1. Create a new folder.

   POST /api/v1/folder/:userId

2. Create Subfolder API

   POST /api/v1/folder/:parentId/subfolder

3. Upload Files API

   POST /api/v1/folder/uploads
   Request body: FormData with file field.
   
4. Rename a file.
   
   PUT /api/v1/folder/file/rename

5. Move a file to a different folder.

   PUT /api/v1/folder/file/move

6. Delete a file.

   DELETE /api/v1/folder/file/delete


