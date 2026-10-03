import React from 'react';
import { fileService } from '../../services/fileService';
import { format } from 'date-fns';
import { FileText, Image as ImageIcon, File, Download, Eye, Trash2, Edit, Copy } from 'lucide-react';

export default function FileCard({ fileData, isAdmin, onDelete, onEdit }) {
    const isImage = fileData.fileType.startsWith('image/');
    const isPdf = fileData.fileType === 'application/pdf';
    
    const handleDelete = async () => {
        if(window.confirm(`Are you sure you want to delete ${fileData.title}?`)) {
            try {
                await fileService.deleteFile(fileData.$id, fileData.fileId);
                if (onDelete) onDelete(fileData.$id);
            } catch(error) {
                alert("Failed to delete file");
            }
        }
    };

    const handleCopyText = async () => {
        try {
            const url = fileService.getFileViewUrl(fileData.fileId);
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch file");
            const text = await response.text();
            await navigator.clipboard.writeText(text);
            alert("File content copied to clipboard!");
        } catch (error) {
            console.error(error);
            alert("Failed to copy file text. This might not be a text file or it is restricted.");
        }
    };

    return (
        <div className="bg-panel rounded-lg shadow-sm border border-white/10 overflow-hidden flex flex-col transition hover:border-mint/50">
            {/* Preview Section */}
            <div className="h-40 bg-ink/50 flex items-center justify-center relative border-b border-white/10">
                {isImage ? (
                    <img src={fileService.getFilePreviewUrl(fileData.fileId)} alt={fileData.title} className="w-full h-full object-cover" />
                ) : isPdf ? (
                    <FileText className="w-16 h-16 text-coral" />
                ) : (
                    <File className="w-16 h-16 text-sky" />
                )}
                <span className="absolute top-2 right-2 bg-panel text-ice text-xs font-bold px-2 py-1 rounded shadow border border-white/10">
                    {fileData.category}
                </span>
            </div>

            {/* Details Section */}
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-semibold text-lg text-ice line-clamp-1">{fileData.title}</h3>
                <p className="text-sm text-ice/50 mb-2 truncate" title={fileData.fileName}>{fileData.fileName}</p>
                <p className="text-sm text-ice/70 mb-4 line-clamp-2 flex-grow">{fileData.description}</p>
                
                <div className="text-xs text-ice/40 mb-4 flex justify-between">
                    <span>{(fileData.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <span>{format(new Date(fileData.$createdAt), 'MMM dd, yyyy')}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex gap-2">
                        <a 
                            href={fileService.getFileViewUrl(fileData.fileId)} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-ice py-2 rounded text-sm transition"
                        >
                            <Eye className="w-4 h-4" /> Preview
                        </a>
                        <a 
                            href={fileService.getFileDownloadUrl(fileData.fileId)} 
                            className="flex-1 flex items-center justify-center gap-1 bg-mint/10 text-mint hover:bg-mint/20 py-2 rounded text-sm transition font-medium"
                        >
                            <Download className="w-4 h-4" /> Download
                        </a>
                    </div>
                    <button 
                        onClick={handleCopyText}
                        className="w-full flex items-center justify-center gap-1 bg-sky/10 text-sky hover:bg-sky/20 py-2 rounded text-sm transition font-medium"
                    >
                        <Copy className="w-4 h-4" /> Copy Content
                    </button>
                </div>

                {/* Admin Actions */}
                {isAdmin && (
                    <div className="flex gap-2 mt-2 pt-2 border-t border-white/10">
                        <button onClick={() => onEdit(fileData)} className="flex-1 flex justify-center items-center gap-1 text-xs text-ice/60 hover:bg-white/5 py-1 rounded">
                            <Edit className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={handleDelete} className="flex-1 flex justify-center items-center gap-1 text-xs text-coral hover:bg-coral/10 py-1 rounded">
                            <Trash2 className="w-3 h-3" /> Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
