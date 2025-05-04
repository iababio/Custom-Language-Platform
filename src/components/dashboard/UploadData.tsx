import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadedFile {
   id: string;
   name: string;
   size: number;
   type: string;
   status: FileStatus;
   progress?: number;
   errorMessage?: string;
}

export const UploadData = () => {
   const [files, setFiles] = useState<UploadedFile[]>([]);
   const [isDragging, setIsDragging] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv', // .csv
      'application/vnd.apple.numbers', // .numbers
   ];
   const allowedExtensions = ['.xlsx', '.xls', '.csv', '.numbers'];

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles) return;

      processFiles(selectedFiles);

      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   const processFiles = (selectedFiles: FileList) => {
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
         const file = selectedFiles[i];
         const extension = file.name.split('.').pop()?.toLowerCase();

         if (!isValidFile(file, extension)) {
            newFiles.push({
               id: `file-${Date.now()}-${i}`,
               name: file.name,
               size: file.size,
               type: file.type,
               status: 'error',
               errorMessage: 'Invalid file type. Please upload .xlsx, .csv, or .numbers files.',
            });
            continue;
         }

         // Valid file
         newFiles.push({
            id: `file-${Date.now()}-${i}`,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'idle',
         });
      }

      setFiles([...files, ...newFiles]);

      // Start uploading the valid files
      newFiles.forEach((file) => {
         if (file.status === 'idle') {
            uploadFile(file);
         }
      });
   };

   const isValidFile = (file: File, extension?: string): boolean => {
      return (
         allowedTypes.includes(file.type) ||
         (extension !== undefined && allowedExtensions.includes(`.${extension}`))
      );
   };

   const uploadFile = async (file: UploadedFile) => {
      setFiles((prev) =>
         prev.map((f) =>
            f.id === file.id ? { ...f, status: 'uploading' as FileStatus, progress: 0 } : f,
         ),
      );

      try {
         let progress = 0;
         const interval = setInterval(() => {
            progress += 10;
            setFiles((prev) =>
               prev.map((f) =>
                  f.id === file.id ? { ...f, progress: Math.min(progress, 100) } : f,
               ),
            );

            if (progress >= 100) {
               clearInterval(interval);

               setTimeout(() => {
                  setFiles((prev) =>
                     prev.map((f) =>
                        f.id === file.id ? { ...f, status: 'success' as FileStatus } : f,
                     ),
                  );
               }, 500);
            }
         }, 300);

         // const { data } = await uploadToAzureBlob(file);
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
         setFiles((prev) =>
            prev.map((f) =>
               f.id === file.id
                  ? {
                       ...f,
                       status: 'error' as FileStatus,
                       errorMessage: 'Failed to upload file. Please try again.',
                    }
                  : f,
            ),
         );
      }
   };

   const removeFile = (id: string) => {
      setFiles((prev) => prev.filter((file) => file.id !== id));
   };

   const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + ' B';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      else return (bytes / 1048576).toFixed(1) + ' MB';
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
   };

   const handleDragLeave = () => {
      setIsDragging(false);
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files.length > 0) {
         processFiles(e.dataTransfer.files);
      }
   };

   return (
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
         <h2 className="text-xl font-semibold mb-4">Upload Data Files</h2>
         <p className="mb-4 text-gray-600">
            Upload spreadsheet files (.xlsx, .csv, .numbers) to process your data
         </p>

         {/* Upload area */}
         <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
               isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
         >
            <Upload size={36} className="mx-auto text-gray-400 mb-3" />
            <p className="mb-2 font-medium">
               Drag and drop files here, or{' '}
               <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-700"
               >
                  browse
               </button>
            </p>
            <p className="text-sm text-gray-500">Supported formats: .xlsx, .csv, .numbers</p>
            <input
               type="file"
               ref={fileInputRef}
               onChange={handleFileChange}
               className="hidden"
               accept=".xlsx,.xls,.csv,.numbers,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/vnd.apple.numbers"
               multiple
            />
         </div>

         {/* File list */}
         <AnimatePresence>
            {files.length > 0 && (
               <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
               >
                  <h3 className="font-medium mb-3">Uploaded files</h3>
                  <ul className="space-y-3">
                     {files.map((file) => (
                        <motion.li
                           key={file.id}
                           className="bg-gray-50 p-3 rounded-md flex items-center"
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, x: -10 }}
                        >
                           <FileText size={20} className="text-gray-500 mr-3" />
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                 <p className="font-medium truncate">{file.name}</p>
                                 <button
                                    onClick={() => removeFile(file.id)}
                                    className="text-gray-400 hover:text-gray-600"
                                    aria-label="Remove file"
                                 >
                                    <X size={16} />
                                 </button>
                              </div>
                              <div className="text-xs text-gray-500 flex justify-between items-center">
                                 <span>{formatFileSize(file.size)}</span>

                                 {file.status === 'uploading' && (
                                    <span className="text-blue-500">
                                       Uploading... {file.progress}%
                                    </span>
                                 )}
                                 {file.status === 'success' && (
                                    <span className="text-green-500 flex items-center">
                                       <Check size={14} className="mr-1" /> Complete
                                    </span>
                                 )}
                                 {file.status === 'error' && (
                                    <span className="text-red-500 flex items-center">
                                       <AlertCircle size={14} className="mr-1" /> Error
                                    </span>
                                 )}
                              </div>

                              {file.status === 'uploading' && (
                                 <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                                    <div
                                       className="h-1 bg-blue-500 rounded-full"
                                       style={{ width: `${file.progress}%` }}
                                    ></div>
                                 </div>
                              )}

                              {file.status === 'error' && file.errorMessage && (
                                 <p className="text-xs text-red-500 mt-1">{file.errorMessage}</p>
                              )}
                           </div>
                        </motion.li>
                     ))}
                  </ul>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};
