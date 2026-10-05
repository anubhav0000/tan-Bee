const STORAGE_KEY = 'tanbee_offline_files';

function getLocalFiles() {
    try {
        if (typeof window === "undefined") return [];
        const data = window.localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveLocalFiles(files) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    window.dispatchEvent(new Event('local-files-changed'));
}

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export const fileService = {
    async uploadFile(file, metadata, userId) {
        try {
            const dataUrl = await fileToBase64(file);
            const newFile = {
                $id: generateId(),
                Title: metadata.title,
                fileName: file.name,
                fileType: file.type || 'unknown',
                fileSize: file.size,
                category: metadata.category,
                description: metadata.description || '',
                uploadedBy: userId || 'local_user',
                $createdAt: new Date().toISOString(),
                dataUrl: dataUrl
            };
            
            const files = getLocalFiles();
            files.unshift(newFile);
            saveLocalFiles(files);
            
            return newFile;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    },

    async getFiles() {
        const documents = getLocalFiles();
        return {
            documents: documents.map(doc => ({
                ...doc,
                title: doc.Title || doc.title
            }))
        };
    },

    async deleteFile(documentId, fileId) {
        const files = getLocalFiles();
        const filtered = files.filter(f => f.$id !== documentId);
        saveLocalFiles(filtered);
        return true;
    },

    async updateFile(documentId, oldFileId, newFile, updatedMetadata) {
        const files = getLocalFiles();
        const index = files.findIndex(f => f.$id === documentId);
        if (index === -1) throw new Error("File not found");

        let updatedFile = { ...files[index] };
        
        updatedFile.Title = updatedMetadata.title;
        updatedFile.category = updatedMetadata.category;
        updatedFile.description = updatedMetadata.description;

        if (newFile) {
            updatedFile.dataUrl = await fileToBase64(newFile);
            updatedFile.fileName = newFile.name;
            updatedFile.fileSize = newFile.size;
            updatedFile.fileType = newFile.type;
        }

        files[index] = updatedFile;
        saveLocalFiles(files);
        return updatedFile;
    },

    getFilePreviewUrl(fileId) {
        const files = getLocalFiles();
        const f = files.find(x => x.$id === fileId);
        return f ? f.dataUrl : '';
    },

    getFileDownloadUrl(fileId) {
        const files = getLocalFiles();
        const f = files.find(x => x.$id === fileId);
        return f ? f.dataUrl : '';
    },
    
    getFileViewUrl(fileId) {
        const files = getLocalFiles();
        const f = files.find(x => x.$id === fileId);
        return f ? f.dataUrl : '';
    }
};
