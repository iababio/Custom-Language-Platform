import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package
import { useUser } from '@clerk/nextjs';
import { useDashboard } from '../../contexts/DashboardContext';
import { Task } from '../../utils/types';

type FileStatus =
   | 'idle'
   | 'uploading'
   | 'success'
   | 'error'
   | 'validating'
   | 'column_error'
   | 'processing';

interface UploadedFile {
   id: string;
   name: string;
   size: number;
   type: string;
   status: FileStatus;
   progress?: number;
   errorMessage?: string;
   columnIssue?: {
      detectedColumns: string[];
      expectedColumns: string[];
   };
}

export const UploadData = () => {
   const [files, setFiles] = useState<UploadedFile[]>([]);
   const [isDragging, setIsDragging] = useState(false);
   const [showColumnModal, setShowColumnModal] = useState(false);
   const [activeFile, setActiveFile] = useState<UploadedFile | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { user } = useUser();
   const { addTaskGroup } = useDashboard();

   const userInitials =
      user?.firstName && user?.lastName
         ? `${user.firstName[0]}${user.lastName[0]}`
         : user?.firstName
           ? `${user.firstName[0]}${user.firstName[1]}`
           : 'U';

   const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv', // .csv
      'application/vnd.apple.numbers', // .numbers
   ];
   const allowedExtensions = ['.xlsx', '.xls', '.csv', '.numbers'];
   const requiredColumns = ['ENGLISH', 'LRL']; // The exact column names we're looking for

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
            status: 'validating',
         });
      }

      setFiles([...files, ...newFiles]);

      // Validate the files first
      newFiles.forEach((fileInfo) => {
         if (fileInfo.status === 'validating') {
            validateFileColumns(
               Array.from(selectedFiles).find((f) => f.name === fileInfo.name)!,
               fileInfo,
            );
         }
      });
   };

   const validateFileColumns = async (file: File, fileInfo: UploadedFile) => {
      try {
         setFiles((prev) =>
            prev.map((f) =>
               f.id === fileInfo.id ? { ...f, status: 'validating' as FileStatus } : f,
            ),
         );

         // Read file contents
         const data = await file.arrayBuffer();
         const workbook = XLSX.read(data);

         // Get the first worksheet
         const worksheet = workbook.Sheets[workbook.SheetNames[0]];

         // Convert worksheet to JSON to get headers
         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

         if (jsonData.length === 0 || jsonData[0].length === 0) {
            setFiles((prev) =>
               prev.map((f) =>
                  f.id === fileInfo.id
                     ? {
                          ...f,
                          status: 'error' as FileStatus,
                          errorMessage: 'File is empty or has no headers.',
                       }
                     : f,
               ),
            );
            return;
         }

         // Get column headers (assuming first row contains headers)
         const headers = jsonData[0].map((header) => String(header).trim().toUpperCase());

         // Check if we have exactly the two required columns
         const hasEnglishColumn = headers.includes(requiredColumns[0]);
         const hasLRLColumn = headers.includes(requiredColumns[1]);

         if (!hasEnglishColumn || !hasLRLColumn) {
            // Set column issue status
            setFiles((prev) =>
               prev.map((f) =>
                  f.id === fileInfo.id
                     ? {
                          ...f,
                          status: 'column_error' as FileStatus,
                          columnIssue: {
                             detectedColumns: headers,
                             expectedColumns: requiredColumns,
                          },
                          errorMessage: 'File must contain columns named "English" and "LRL".',
                       }
                     : f,
               ),
            );

            // Set active file for the modal
            setActiveFile({
               ...fileInfo,
               status: 'column_error',
               columnIssue: {
                  detectedColumns: headers,
                  expectedColumns: requiredColumns,
               },
            });

            setShowColumnModal(true);
            return;
         }

         // Columns are valid, proceed with upload
         uploadFile(file, {
            ...fileInfo,
            status: 'processing',
         });
      } catch (error) {
         console.error('Error validating file:', error);
         setFiles((prev) =>
            prev.map((f) =>
               f.id === fileInfo.id
                  ? {
                       ...f,
                       status: 'error' as FileStatus,
                       errorMessage:
                          'Failed to validate file format. Please check the file structure.',
                    }
                  : f,
            ),
         );
      }
   };

   const isValidFile = (file: File, extension?: string): boolean => {
      return (
         allowedTypes.includes(file.type) ||
         (extension !== undefined && allowedExtensions.includes(`.${extension}`))
      );
   };

   const uploadFile = async (file: File, fileInfo: UploadedFile) => {
      setFiles((prev) =>
         prev.map((f) =>
            f.id === fileInfo.id ? { ...f, status: 'uploading' as FileStatus, progress: 0 } : f,
         ),
      );

      try {
         // Process upload with progress indicator
         let progress = 0;
         const interval = setInterval(() => {
            progress += 10;
            setFiles((prev) =>
               prev.map((f) =>
                  f.id === fileInfo.id ? { ...f, progress: Math.min(progress, 95) } : f,
               ),
            );

            if (progress >= 95) {
               clearInterval(interval);
            }
         }, 300);

         // Process the file data to extract content
         const data = await file.arrayBuffer();
         const workbook = XLSX.read(data);
         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
         const jsonData = XLSX.utils.sheet_to_json(worksheet);

         // Extract proper column names from the first row
         const columnMapping: Record<string, string> = {};
         const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
         headerRow.forEach((header) => {
            const upperHeader = String(header).trim().toUpperCase();
            if (upperHeader === 'ENGLISH') columnMapping.ENGLISH = header;
            if (upperHeader === 'LRL') columnMapping.LRL = header;
         });

         // Convert to task format
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const tasks: Task[] = jsonData.map((row: any, index) => ({
            id: uuidv4(),
            english: row[columnMapping.ENGLISH],
            lrl: row[columnMapping.LRL],
            isChecked: false,
            assignees: [userInitials], // Current user as the editor
            priority: index % 3 === 0 ? 'Urgent' : index % 3 === 1 ? 'Normal' : 'Low',
            progress: 0,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default due date 7 days from now
         }));

         // Create a new task group from the file
         const projectName = file.name.replace(/\.[^/.]+$/, ''); // Remove file extension

         const newTaskGroup = {
            id: uuidv4(),
            title: projectName,
            color: `bg-${getRandomColor()}-400`,
            tasks: tasks,
         };

         // Add the task group to global state
         addTaskGroup(newTaskGroup);

         // Update file status to success
         clearInterval(interval);
         setFiles((prev) =>
            prev.map((f) =>
               f.id === fileInfo.id ? { ...f, status: 'success' as FileStatus, progress: 100 } : f,
            ),
         );
      } catch (error) {
         console.error('Error processing file:', error);
         setFiles((prev) =>
            prev.map((f) =>
               f.id === fileInfo.id
                  ? {
                       ...f,
                       status: 'error' as FileStatus,
                       errorMessage: 'Failed to process file. Please try again.',
                    }
                  : f,
            ),
         );
      }
   };

   // Helper function to get random colors
   const getRandomColor = () => {
      const colors = ['blue', 'green', 'yellow', 'purple', 'pink', 'indigo', 'teal', 'orange'];
      return colors[Math.floor(Math.random() * colors.length)];
   };

   const removeFile = (id: string) => {
      // If removing the active file in the modal, close the modal
      if (activeFile?.id === id) {
         setShowColumnModal(false);
         setActiveFile(null);
      }
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

   // Close the column error modal
   const closeColumnModal = () => {
      setShowColumnModal(false);
      setActiveFile(null);
   };

   return (
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
         <h2 className="text-xl font-semibold mb-4">Upload Data Files</h2>
         <p className="mb-4 text-gray-600">
            {`
            Upload spreadsheet files (.xlsx, .csv, .numbers) with columns named "English" and
            "LRL"`}
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
            <p className="text-sm text-gray-500 mt-1">
               {`
               Must contain columns named "English" and "LRL"`}
            </p>
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

                                 {file.status === 'validating' && (
                                    <span className="text-blue-500">Validating...</span>
                                 )}
                                 {file.status === 'processing' && (
                                    <span className="text-blue-500">Processing...</span>
                                 )}
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
                                 {file.status === 'column_error' && (
                                    <span className="text-amber-500 flex items-center">
                                       <AlertTriangle size={14} className="mr-1" /> Column Error
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

                              {(file.status === 'error' || file.status === 'column_error') &&
                                 file.errorMessage && (
                                    <p className="text-xs text-red-500 mt-1">{file.errorMessage}</p>
                                 )}

                              {file.status === 'column_error' && (
                                 <button
                                    onClick={() => {
                                       setActiveFile(file);
                                       setShowColumnModal(true);
                                    }}
                                    className="text-xs text-blue-500 mt-1 hover:text-blue-700"
                                 >
                                    View Column Details
                                 </button>
                              )}
                           </div>
                        </motion.li>
                     ))}
                  </ul>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Column Error Modal */}
         {showColumnModal && activeFile && activeFile.columnIssue && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-medium">Column Structure Error</h3>
                     <button
                        onClick={closeColumnModal}
                        className="text-gray-500 hover:text-gray-700"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <div className="mb-4">
                     <div className="flex items-center mb-2">
                        <AlertTriangle size={18} className="text-amber-500 mr-2" />
                        <p className="text-gray-700">
                           {`
                           The uploaded file doesn't have the required column structure.`}
                        </p>
                     </div>

                     <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">File:</span> {activeFile.name}
                     </p>

                     <div className="mt-4">
                        <p className="text-sm font-medium mb-1">Expected columns:</p>
                        <div className="bg-green-50 p-2 rounded border border-green-200 mb-3">
                           {activeFile.columnIssue.expectedColumns.map((col, i) => (
                              <span
                                 key={i}
                                 className="inline-block bg-green-100 text-green-800 rounded px-2 py-1 text-xs mr-1 mb-1"
                              >
                                 {col}
                              </span>
                           ))}
                        </div>

                        <p className="text-sm font-medium mb-1">Detected columns:</p>
                        <div className="bg-red-50 p-2 rounded border border-red-200">
                           {activeFile.columnIssue.detectedColumns.map((col, i) => (
                              <span
                                 key={i}
                                 className="inline-block bg-red-100 text-red-800 rounded px-2 py-1 text-xs mr-1 mb-1"
                              >
                                 {col}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                     {`
                     Please modify your spreadsheet to include columns named "English"
                     and "LRL".`}
                  </p>

                  <div className="flex justify-end">
                     <button
                        onClick={closeColumnModal}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
