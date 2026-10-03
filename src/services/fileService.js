import client, { databases, storage, appwriteId } from '../lib/appwrite';
import { Query, Permission, Role } from 'appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COL_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export const fileService = {
    // 1. Upload file to Storage, then save metadata to DB
    async uploadFile(file, metadata, userId) {
        try {
            // Upload actual file to Storage
            const uploadedFile = await storage.createFile(
                BUCKET_ID,
                appwriteId.unique(),
                file
            );

            // Save metadata to Database
            const document = await databases.createDocument(
                DB_ID,
                COL_ID,
                appwriteId.unique(),
                {
                    Title: metadata.title,
                    fileName: file.name,
                    fileId: uploadedFile.$id,
                    category: metadata.category,
                    description: metadata.description || '',
                    fileType: file.type || 'unknown',
                    fileSize: file.size,
                    uploadedBy: userId,
                },
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(userId)),
                    Permission.delete(Role.user(userId))
                ]
            );
            return document;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    },

    // 2. Get all files
    async getFiles(queries = [Query.orderDesc('$createdAt')]) {
        try {
            const response = await databases.listDocuments(DB_ID, COL_ID, queries);
            response.documents = response.documents.map(doc => ({
                ...doc,
                title: doc.Title || doc.title
            }));
            return response;
        } catch (error) {
            console.error('Get Files Error:', error);
            throw error;
        }
    },

    // 3. Delete file from Storage AND Database
    async deleteFile(documentId, fileId) {
        try {
            // Must delete storage file first
            await storage.deleteFile(BUCKET_ID, fileId);
            // Then delete DB record
            await databases.deleteDocument(DB_ID, COL_ID, documentId);
            return true;
        } catch (error) {
            console.error('Delete Error:', error);
            throw error;
        }
    },

    // 4. Update file metadata (and optionally replace file)
    async updateFile(documentId, oldFileId, newFile, updatedMetadata) {
        try {
            let finalFileId = oldFileId;
            let finalFileName = updatedMetadata.fileName;
            let finalFileSize = updatedMetadata.fileSize;
            let finalFileType = updatedMetadata.fileType;

            // If a new file is uploaded to replace the old one
            if (newFile) {
                // Upload new file
                const uploadedFile = await storage.createFile(BUCKET_ID, appwriteId.unique(), newFile);
                finalFileId = uploadedFile.$id;
                finalFileName = newFile.name;
                finalFileSize = newFile.size;
                finalFileType = newFile.type;

                // Delete old file from storage
                await storage.deleteFile(BUCKET_ID, oldFileId);
            }

            // Update Database record
            const document = await databases.updateDocument(
                DB_ID,
                COL_ID,
                documentId,
                {
                    Title: updatedMetadata.title,
                    category: updatedMetadata.category,
                    description: updatedMetadata.description,
                    fileId: finalFileId,
                    fileName: finalFileName,
                    fileSize: finalFileSize,
                    fileType: finalFileType
                }
            );
            return document;
        } catch (error) {
            console.error('Update Error:', error);
            throw error;
        }
    },

    // 5. Get File Preview URL
    getFilePreviewUrl(fileId) {
        return storage.getFilePreview(BUCKET_ID, fileId).href;
    },

    // 6. Get File Download URL
    getFileDownloadUrl(fileId) {
        return storage.getFileDownload(BUCKET_ID, fileId).href;
    },
    
    // 7. Get File View URL
    getFileViewUrl(fileId) {
        return storage.getFileView(BUCKET_ID, fileId).href;
    }
};
