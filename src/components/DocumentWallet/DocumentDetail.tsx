import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    XIcon,
    FileTextIcon,
    FileIcon,
    ImageIcon,
    FileSpreadsheetIcon,
    DownloadIcon,
    TrashIcon,
    ClockIcon,
    UploadIcon,
    CheckIcon,
    TagIcon,
    LockIcon,
    CalendarIcon,
    UserIcon,
    InfoIcon,
} from 'lucide-react';
import {
    uploadFileToBlobStorage,
    deleteBlob,
    getBlobNameFromUrl,
    generateDownloadSasUrl,
} from '../../services/AzureBlobService';
import { updateDocument, deleteDocument } from '../../services/DataverseService';

type DocumentStatus = 'Active' | 'Pending' | 'Expired' | string | undefined;

type DocumentVersion = {
    id?: string;
    fileUrl: string;
    uploadDate: string;
    uploadedBy: string;
    notes?: string;
};

type DocumentItem = {
    id: string;
    name: string;
    fileType: string;
    fileSize: string;
    fileUrl: string;
    uploadDate: string;
    expiryDate?: string;
    uploadedBy: string;
    category?: string;
    status?: DocumentStatus;
    isConfidential?: boolean;
    tags?: string[];
    description?: string;
    versionNumber?: number;
    versions?: DocumentVersion[];
};

type DocumentDetailProps = {
    readonly document: DocumentItem;
    readonly onClose: () => void;
    readonly onReplace: (
        id: string,
        version: DocumentVersion & {
            fileType: string;
            fileSize: string;
            versionNumber: number;
            previousVersionId: string;
        },
    ) => void;
    readonly onDelete: (id: string) => void;
};

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileType = (filename: string) => {
    const ext = (filename.split('.').pop() ?? '').toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'spreadsheet';
    if (['ppt', 'pptx'].includes(ext)) return 'presentation';
    if (['doc', 'docx', 'txt'].includes(ext)) return 'document';
    return 'file';
};

const statusClasses = (status: DocumentStatus) => {
    if (status === 'Active') return 'bg-green-100 text-green-800';
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Expired') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
};

const FileIconByType = ({ type }: { readonly type: string }) => {
    switch (type) {
        case 'pdf':
            return <FileTextIcon size={24} className="text-red-500" />;
        case 'image':
            return <ImageIcon size={24} className="text-blue-500" />;
        case 'spreadsheet':
            return <FileSpreadsheetIcon size={24} className="text-green-500" />;
        default:
            return <FileIcon size={24} className="text-gray-500" />;
    }
};

const StatusBadge = ({ status }: { readonly status?: DocumentStatus }) => (
    <span className={`px-2 py-1 text-xs rounded-full ${statusClasses(status)}`}>
        {status ?? 'Unknown'}
    </span>
);

const TagList = ({ tags }: { readonly tags: string[] }) => (
    <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
            <span
                key={tag}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
                {tag}
            </span>
        ))}
    </div>
);

type ReplaceSectionProps = {
    readonly newFile: File | null;
    readonly isProcessing: boolean;
    readonly uploadProgress: number;
    readonly onTriggerUpload: () => void;
    readonly onCancel: () => void;
    readonly onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly fileInputRef: React.RefObject<HTMLInputElement>;
};

const ReplaceSection = ({
    newFile,
    isProcessing,
    uploadProgress,
    onTriggerUpload,
    onCancel,
    onFileChange,
    fileInputRef,
}: ReplaceSectionProps) => (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-blue-800">Replace Document</h3>
            <button
                className="text-blue-500 hover:text-blue-700"
                onClick={onCancel}
                disabled={isProcessing}
            >
                <XIcon size={16} />
            </button>
        </div>
        {!newFile ? (
            <div
                className={`border-2 border-dashed border-blue-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                role="button"
                tabIndex={0}
                onClick={onTriggerUpload}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onTriggerUpload();
                    }
                }}
            >
                <UploadIcon size={24} className="text-blue-500" />
                <p className="mt-2 text-sm text-blue-600 text-center">
                    Click to upload a new version
                </p>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={onFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                    disabled={isProcessing}
                />
            </div>
        ) : (
            <div>
                <div className="flex items-center">
                    <FileIcon size={20} className="text-blue-500 mr-3" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-blue-700">
                            {newFile.name}
                        </p>
                        <p className="text-xs text-blue-500">
                            {newFile.size < 1024 * 1024
                                ? `${(newFile.size / 1024).toFixed(1)} KB`
                                : `${(newFile.size / (1024 * 1024)).toFixed(1)} MB`}
                        </p>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1">
                        <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{
                                width: `${uploadProgress}%`,
                            }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-blue-600">{uploadProgress}%</span>
                        {uploadProgress === 100 && (
                            <span className="text-xs text-green-500 flex items-center">
                                <CheckIcon size={12} className="mr-1" /> Complete
                            </span>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
);

type DeleteConfirmProps = {
    readonly onCancel: () => void;
    readonly onConfirm: () => void;
    readonly disabled: boolean;
};

const DeleteConfirmation = ({ onCancel, onConfirm, disabled }: DeleteConfirmProps) => (
    <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
        <h3 className="text-sm font-medium text-red-800 mb-2">Confirm Deletion</h3>
        <p className="text-sm text-red-600 mb-3">
            Are you sure you want to delete this document? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
            <button
                className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                onClick={onCancel}
                disabled={disabled}
            >
                Cancel
            </button>
            <button
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                onClick={onConfirm}
                disabled={disabled}
            >
                {disabled ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    </div>
);

type VersionHistoryProps = {
    readonly document: DocumentItem;
    readonly onDownload: (url: string) => void;
};

const VersionHistory = ({ document, onDownload }: VersionHistoryProps) => {
    const versionItems = useMemo(() => document.versions ?? [], [document.versions]);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Version History</h3>
            </div>
            <div className="divide-y divide-gray-200">
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                            <FileIcon size={16} className="text-blue-600" />
                        </div>
                        <div className="ml-3 flex-1">
                            <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-800">Current Version</p>
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                    Latest
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Uploaded {formatDate(document.uploadDate)} by {document.uploadedBy}
                            </p>
                            <div className="mt-2 flex gap-2">
                                <button
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                    onClick={() => onDownload(document.fileUrl)}
                                >
                                    <DownloadIcon size={12} className="mr-1" /> Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {versionItems.map((version) => (
                    <div key={version.id ?? version.fileUrl} className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
                                <FileIcon size={16} className="text-gray-600" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                    Version {versionItems.length - versionItems.indexOf(version)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Uploaded {formatDate(version.uploadDate)} by {version.uploadedBy}
                                </p>
                                {version.notes && (
                                    <p className="text-xs text-gray-600 mt-1">{version.notes}</p>
                                )}
                                <div className="mt-2 flex gap-2">
                                    <button
                                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                        onClick={() => onDownload(version.fileUrl)}
                                    >
                                        <DownloadIcon size={12} className="mr-1" /> Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {!versionItems.length && (
                    <div className="p-6 text-center text-gray-500">
                        <p className="text-sm">No previous versions available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export function DocumentDetail({ document, onClose, onReplace, onDelete }: DocumentDetailProps) {
    const [isReplacing, setIsReplacing] = useState(false);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'versions'>('details');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const startProgressSimulation = useCallback(() => {
        const intervalId = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(intervalId);
                    return 95;
                }
                return prev + 5;
            });
        }, 200);
        return intervalId;
    }, []);

    const handleReplaceFile = useCallback(
        async (file: File) => {
            try {
                setIsProcessing(true);
                setError(null);
                const progressInterval = startProgressSimulation();
                const blobName = `${Date.now()}-${file.name.replaceAll(/\s+/g, '_')}`;
                const fileUrl = await uploadFileToBlobStorage(file, blobName);
                const newVersion = {
                    fileType: getFileType(file.name),
                    fileSize: formatFileSize(file.size),
                    fileUrl,
                    uploadDate: new Date().toISOString().split('T')[0],
                    versionNumber: (document.versionNumber || 1) + 1,
                    previousVersionId: document.id,
                };
                await updateDocument(document.id, newVersion);
                clearInterval(progressInterval);
                setUploadProgress(100);
                setTimeout(() => {
                    setIsProcessing(false);
                    onReplace(document.id, newVersion);
                }, 500);
            } catch (replacementError) {
                console.error('Error replacing document:', replacementError);
                setIsProcessing(false);
                setError('Failed to replace document. Please try again.');
                setUploadProgress(0);
            }
        },
        [document.id, document.versionNumber, onReplace, startProgressSimulation],
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
                setNewFile(selectedFile);
                handleReplaceFile(selectedFile);
            }
        },
        [handleReplaceFile],
    );

    const handleDocumentDelete = useCallback(async () => {
        try {
            setIsProcessing(true);
            setError(null);
            const blobName = getBlobNameFromUrl(document.fileUrl);
            await deleteBlob(blobName);
            await deleteDocument(document.id);
            setIsProcessing(false);
            onDelete(document.id);
        } catch (deleteError) {
            console.error('Error deleting document:', deleteError);
            setIsProcessing(false);
            setError('Failed to delete document. Please try again.');
        }
    }, [document.fileUrl, document.id, onDelete]);

    const handleDownload = useCallback(async (fileUrl: string) => {
        try {
            const blobName = getBlobNameFromUrl(fileUrl);
            const downloadUrl = await generateDownloadSasUrl(blobName);
            window.open(downloadUrl, '_blank', 'noopener,noreferrer');
        } catch (downloadError) {
            console.error('Error generating download URL:', downloadError);
            setError('Failed to generate download link. Please try again.');
        }
    }, []);

    const triggerUpload = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const statusBadge = useMemo(() => <StatusBadge status={document.status} />, [document.status]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                        {document.name}
                    </h2>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'details'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'versions'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('versions')}
                    >
                        Version History ({document.versions ? document.versions.length + 1 : 1})
                    </button>
                </div>
                {error && (
                    <div className="bg-red-50 p-3 border-b border-red-200">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'details' ? (
                        <div className="p-4">
                            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center">
                                <FileIconByType type={document.fileType} />
                                <div className="ml-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {document.name}
                                        </span>
                                        {document.isConfidential && (
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                                                <LockIcon size={10} className="mr-1" /> Confidential
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {document.fileSize} • Uploaded {formatDate(document.uploadDate)}
                                    </p>
                                </div>
                                <button
                                    className="text-blue-600 hover:text-blue-800 p-2"
                                    onClick={() => handleDownload(document.fileUrl)}
                                >
                                    <DownloadIcon size={18} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Category</p>
                                    <p className="text-sm text-gray-800">{document.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <p className="text-sm">{statusBadge}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Upload Date</p>
                                    <p className="text-sm text-gray-800 flex items-center">
                                        <CalendarIcon size={14} className="mr-1 text-gray-400" />
                                        {formatDate(document.uploadDate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                                    <p className="text-sm text-gray-800 flex items-center">
                                        <ClockIcon size={14} className="mr-1 text-gray-400" />
                                        {formatDate(document.expiryDate ?? '')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Uploaded By</p>
                                    <p className="text-sm text-gray-800 flex items-center">
                                        <UserIcon size={14} className="mr-1 text-gray-400" />
                                        {document.uploadedBy}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">File Type</p>
                                    <p className="text-sm text-gray-800">
                                        {document.fileType.charAt(0).toUpperCase() +
                                            document.fileType.slice(1)}
                                    </p>
                                </div>
                                {document.tags && document.tags.length > 0 && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                                            <TagIcon size={14} className="mr-1" /> Tags
                                        </p>
                                        <TagList tags={document.tags} />
                                    </div>
                                )}
                                {document.description && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                                            <InfoIcon size={14} className="mr-1" /> Description
                                        </p>
                                        <p className="text-sm text-gray-800 whitespace-pre-line">
                                            {document.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {isReplacing ? (
                                <ReplaceSection
                                    newFile={newFile}
                                    isProcessing={isProcessing}
                                    uploadProgress={uploadProgress}
                                    onTriggerUpload={triggerUpload}
                                    onCancel={() => {
                                        setIsReplacing(false);
                                        setNewFile(null);
                                        setUploadProgress(0);
                                    }}
                                    onFileChange={handleFileChange}
                                    fileInputRef={fileInputRef}
                                />
                            ) : (
                                <div className="flex gap-2 mb-6">
                                    <button
                                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50"
                                        onClick={() => setIsReplacing(true)}
                                        disabled={isProcessing}
                                    >
                                        <UploadIcon size={16} className="mr-1" />
                                        Replace Document
                                    </button>
                                    <button
                                        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        disabled={isProcessing}
                                    >
                                        <TrashIcon size={16} className="mr-1" />
                                        Delete
                                    </button>
                                </div>
                            )}
                            {showDeleteConfirm && (
                                <DeleteConfirmation
                                    onCancel={() => setShowDeleteConfirm(false)}
                                    onConfirm={handleDocumentDelete}
                                    disabled={isProcessing}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="p-4">
                            <VersionHistory document={document} onDownload={handleDownload} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
