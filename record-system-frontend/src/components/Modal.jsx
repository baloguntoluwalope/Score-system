const Modal = ({ title, onClose, children, footer }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal__header">
        <h3 className="modal__title">{title}</h3>
        <button className="modal__close" onClick={onClose}>✕</button>
      </div>
      <div className="modal__body">{children}</div>
      {footer && <div className="modal__footer">{footer}</div>}
    </div>
  </div>
);

export default Modal;