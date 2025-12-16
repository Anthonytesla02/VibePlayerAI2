import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    onFileSelect(file);
    toast.success(`Added "${file.name.replace(/\.[^/.]+$/, '')}"`);
    
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => inputRef.current?.click()}
        className="w-full p-4 rounded-xl glass border border-dashed border-primary/30 hover:border-primary/60 transition-colors flex items-center justify-center gap-3 text-muted-foreground hover:text-foreground"
      >
        <div className="p-2 rounded-lg gradient-primary">
          <Plus size={20} className="text-primary-foreground" />
        </div>
        <span className="font-medium">Add Music</span>
      </motion.button>
    </>
  );
};
