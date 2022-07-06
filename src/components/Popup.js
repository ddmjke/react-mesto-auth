import React from "react";


export default function Popup({name, isOpen, onClose, children}) {
  React.useEffect(() => {
    if (isOpen) return;

    const closeByEsc = (evt) => {
      if (evt.key === 'Escape') { 
        onClose(); 
      }
    }

    document.addEventListener('keydown', closeByEsc);
    return () => document.removeEventListener('keydown', closeByEsc);
  }, [isOpen, onClose]);

  const handleOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
      className={`pop-up ${isOpen ? 'pop-up_active' : ''} pop-up_type_${name}`}
      onClick={handleOverlay}
    >
      <div className="pop-up__container">
        {children}
        <button
          className="pop-up__close-button"
          type="button"
          onClick={onClose}
        /> 
      </div>
    </div>
  );
}