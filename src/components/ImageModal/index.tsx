import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageModalProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageModal = ({ images, initialIndex = 0, onClose }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center z-50 p-4"
      onClick={onClose}
    >

      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-neon-red transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* Botão Anterior */}
        <button onClick={goToPrevious} className="absolute left-0 z-10 p-4 text-white/50 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Visualização ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain rounded-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        <button onClick={goToNext} className="absolute right-0 z-10 p-4 text-white/50 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </motion.div>
  );
};

export default ImageModal;