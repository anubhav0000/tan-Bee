import React, { useState, useRef } from 'react';
import { fileService } from '../../services/fileService';
import { Upload, X, Type, FileUp } from 'lucide-react';

export default function FileUpload({ user, onSuccess }) {
    const [mode, setMode] = useState('file'); // 'file' or 'text'
    const [file, setFile] = useState(null);
    const [textContent, setTextContent] = useState('');
    const [metadata, setMetadata] = useState({ title: '', category: 'General', description: '' });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        let fileToUpload = file;

        if (mode === 'text') {
            if (!textContent.trim()) return setError('Please enter some text to upload.');
            const fileName = metadata.title ? `${metadata.title.replace(/\s+/g, '_')}.txt` : 'snippet.txt';
            fileToUpload = new File([textContent], fileName, { type: 'text/plain' });
        } else {
            if (!fileToUpload) return setError('Please select a file first.');
        }

        if (!metadata.title) return setError('Title is required.');

        setUploading(true);
        setError('');

        try {
            await fileService.uploadFile(fileToUpload, metadata, user.$id);
            setFile(null);
            setTextContent('');
            setMetadata({ title: '', category: 'General', description: '' });
            if (onSuccess) onSuccess();
            alert("Upload successful!");
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="glass-card p-6 rounded-lg shadow-md border border-white/10">
            <h2 className="text-xl font-display text-ice mb-6">Upload Resource</h2>
            {error && <div className="bg-coral/10 border border-coral/20 text-coral p-3 rounded mb-6 text-sm">{error}</div>}
            
            <div className="flex bg-ink rounded-lg p-1 mb-6 border border-white/5">
                <button 
                    type="button"
                    onClick={() => setMode('file')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${mode === 'file' ? 'bg-panel text-mint shadow' : 'text-ice/50 hover:text-ice'}`}
                >
                    <FileUp className="w-4 h-4" /> Upload File
                </button>
                <button 
                    type="button"
                    onClick={() => setMode('text')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors ${mode === 'text' ? 'bg-panel text-mint shadow' : 'text-ice/50 hover:text-ice'}`}
                >
                    <Type className="w-4 h-4" /> Paste Text
                </button>
            </div>

            <form onSubmit={handleUpload} className="flex flex-col gap-4">
                {mode === 'file' ? (
                    <div 
                        className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center cursor-pointer hover:bg-white/5 transition mb-2"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={(e) => setFile(e.target.files[0])} 
                            className="hidden" 
                        />
                        <Upload className="mx-auto h-10 w-10 text-ice/40 mb-3" />
                        {file ? (
                            <div className="text-sm font-medium text-mint flex items-center justify-center gap-2">
                                {file.name} 
                                <X className="w-4 h-4 cursor-pointer hover:text-coral transition-colors" onClick={(e) => { e.stopPropagation(); setFile(null); }} />
                            </div>
                        ) : (
                            <p className="text-ice/60 text-sm">Click or drag & drop a file here to upload</p>
                        )}
                    </div>
                ) : (
                    <div className="mb-2">
                        <textarea 
                            placeholder="Paste your text content here... (e.g. notes, code snippets, important links)" 
                            className="w-full p-4 border border-white/10 rounded-lg bg-ink text-ice focus:outline-none focus:border-mint font-mono text-sm resize-y min-h-[160px]"
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                        ></textarea>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="text" 
                        placeholder="Title (e.g. Chapter 1 Notes)" 
                        required
                        className="p-3 border border-white/10 rounded-lg bg-ink text-ice focus:outline-none focus:border-mint"
                        value={metadata.title}
                        onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                    />
                    <select 
                        className="p-3 border border-white/10 rounded-lg bg-ink text-ice focus:outline-none focus:border-mint appearance-none"
                        value={metadata.category}
                        onChange={(e) => setMetadata({...metadata, category: e.target.value})}
                    >
                        <option value="General">General</option>
                        <option value="Biology">Biology</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="Math">Math</option>
                        <option value="Programming">Programming</option>
                        <option value="Notes">Notes</option>
                        <option value="Snippets">Snippets</option>
                    </select>
                </div>
                
                <textarea 
                    placeholder="Short Description (Optional)" 
                    className="w-full p-3 border border-white/10 rounded-lg bg-ink text-ice focus:outline-none focus:border-mint resize-none"
                    rows="2"
                    value={metadata.description}
                    onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                ></textarea>

                <button 
                    type="submit" 
                    disabled={uploading || (mode === 'file' && !file) || (mode === 'text' && !textContent.trim())}
                    className="w-full bg-mint/20 text-mint border border-mint/20 py-3 rounded-lg font-semibold hover:bg-mint/30 transition-colors disabled:opacity-50 mt-2"
                >
                    {uploading ? 'Uploading...' : mode === 'text' ? 'Save as Text File' : 'Upload File'}
                </button>
            </form>
        </div>
    );
}
