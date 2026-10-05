import { useState, useEffect } from 'react';
import { fileService } from '../services/fileService';

export const useFiles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fileService.getFiles();
            setFiles(response.documents);
        } catch (error) {
            console.error("Error fetching files", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();

        const handleLocalChange = () => fetchFiles();
        if (typeof window !== 'undefined') {
            window.addEventListener('local-files-changed', handleLocalChange);
            return () => window.removeEventListener('local-files-changed', handleLocalChange);
        }
    }, []);

    return { files, loading, refetch: fetchFiles };
};
