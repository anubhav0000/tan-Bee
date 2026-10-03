import { useState, useEffect } from 'react';
import { fileService } from '../services/fileService';
import client from '../lib/appwrite';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COL_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

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

        const unsubscribe = client.subscribe(`databases.${DB_ID}.collections.${COL_ID}.documents`, response => {
            const payload = { ...response.payload, title: response.payload.Title || response.payload.title };
            
            if (response.events.some(e => e.includes('.create'))) {
                setFiles(prev => [payload, ...prev]);
            }
            if (response.events.some(e => e.includes('.delete'))) {
                setFiles(prev => prev.filter(file => file.$id !== payload.$id));
            }
            if (response.events.some(e => e.includes('.update'))) {
                setFiles(prev => prev.map(file => 
                    file.$id === payload.$id ? payload : file
                ));
            }
        });

        return () => unsubscribe();
    }, []);

    return { files, loading, refetch: fetchFiles };
};
