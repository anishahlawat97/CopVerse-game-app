import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  children: React.ReactNode;
  containerClass?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, header, children, containerClass }) => {
  if (!isOpen) return null; // Return null if the modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />
      <div className={`relative min-w-[90vw] md:min-w-[40vw] min-h-[25vh] bg-white dark:bg-black rounded-lg p-4 border border-gray-300 dark:border-gray-700 transition-opacity duration-300 ${containerClass}`}>
        <div className="flex justify-between items-center pb-2 border-b border-gray-300 dark:border-gray-600 text-xl font-semibold text-black dark:text-white">
          <h1>{header}</h1>
          <button
            className="font-bold cursor-pointer text-black dark:text-white hover:bg-red-400 hover:text-gray-100 p-2 py-0 rounded-md"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;