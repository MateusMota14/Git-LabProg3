// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Image, Upload, Camera } from "lucide-react";
// import { cn } from '@/lib/utils';

// interface ImageUploadProps {
//   onImagesSelected: (urls: string[]) => void;
//   existingImages?: string[];
//   maxImages?: number;
//   error?: string;
// }

// const ImageUpload: React.FC<ImageUploadProps> = ({ 
//   onImagesSelected, 
//   existingImages = [], 
//   maxImages = 4,
//   error
// }) => {
//   const [previewImages, setPreviewImages] = useState<string[]>(existingImages);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || e.target.files.length === 0) return;
    
//     const filesToProcess = Array.from(e.target.files);
//     const availableSlots = maxImages - previewImages.length;
    
//     if (filesToProcess.length > availableSlots) {
//       console.warn(`Only ${availableSlots} more images can be uploaded.`);
//       filesToProcess.splice(availableSlots);
//     }

//     const newImages = filesToProcess.map(file => URL.createObjectURL(file));
//     const updatedImages = [...previewImages, ...newImages];
    
//     setPreviewImages(updatedImages);
//     onImagesSelected(updatedImages);
//   };

//   const removeImage = (index: number) => {
//     const updatedImages = [...previewImages];
//     updatedImages.splice(index, 1);
//     setPreviewImages(updatedImages);
//     onImagesSelected(updatedImages);
//   };

//   return (
//     <div className="w-full mb-6">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Pet Photos <span className="text-gray-500">(max {maxImages})</span>
//       </label>
      
//       <div className={cn(
//         "p-4 border-2 border-dashed rounded-md",
//         error ? "border-red-400 bg-red-50" : "border-yellow-300 bg-yellow-50",
//         "transition-colors"
//       )}>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
//           {previewImages.map((url, index) => (
//             <div key={index} className="relative aspect-square">
//               <img
//                 src={url}
//                 alt={`Preview ${index + 1}`}
//                 className="w-full h-full object-cover rounded-md"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeImage(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
          
//           {previewImages.length < maxImages && (
//             <label className="cursor-pointer border-2 border-dashed border-yellow-300 rounded-md flex items-center justify-center aspect-square bg-yellow-50 hover:bg-yellow-100 transition-colors">
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//               <div className="flex flex-col items-center text-yellow-600">
//                 <Camera className="mb-1 w-6 h-6" />
//                 <span className="text-xs text-center">Add Photo</span>
//               </div>
//             </label>
//           )}
//         </div>
        
//         {previewImages.length < maxImages && (
//           <div className="flex justify-center">
//             <label className="cursor-pointer">
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 className="border-yellow-400 text-yellow-700 hover:bg-yellow-50"
//               >
//                 <Upload className="mr-2 h-4 w-4" />
//                 Upload Images
//               </Button>
//             </label>
//           </div>
//         )}
//       </div>
      
//       {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//     </div>
//   );
// };

// export default ImageUpload;