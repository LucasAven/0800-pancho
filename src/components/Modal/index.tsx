export interface IModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IModalProps> = ({ title, isOpen, children, onClose }) => (
  <dialog
    className="fixed inset-0 z-50 max-h-screen w-full overflow-y-auto bg-transparent sm:max-w-5xl"
    open={isOpen}
  >
    <div className="flex items-center justify-center text-center">
      <span
        className="relative z-50 inline-block w-full overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 p-6 pt-12 text-left align-middle shadow-xl transition-all sm:px-20 sm:py-12"
        role="dialog"
        aria-modal="true"
      >
        <button
          aria-label="Cerrar"
          className="absolute top-0 right-0 mt-4 mr-8 text-gray-400 hover:text-white sm:mt-8 sm:mr-8"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
            fill="currentColor"
            width="20px"
            height="20px"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M264.5 247l114-114c4.7-4.7 4.7-12.3 0-17l-22.6-22.6c-4.7-4.7-12.3-4.7-17 0L224 206.5 110 92.5c-4.7-4.7-12.3-4.7-17 0L70.5 115c-4.7 4.7-4.7 12.3 0 17l114 114-114 114c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c4.7 4.7 12.3 4.7 17 0l114-114 114 114c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17L264.5 247z" />
          </svg>
        </button>
        <h3 className="text-center text-3xl font-bold leading-6 text-white">
          {title}
        </h3>
        {children}
      </span>
      <div className="fixed inset-0 z-10 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
    </div>
  </dialog>
);

export default Modal;
