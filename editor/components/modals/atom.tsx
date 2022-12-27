import React from "react";
import ReactModal from "react-modal";

export interface IModal {
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ isOpen, onClose, children }: React.PropsWithChildren<IModal>) {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
      {children}
    </ReactModal>
  );
}

export default Modal;

const modalStyles: object = {
  content: {
    overflow: "unset",
    position: "unset",
    width: "fit-content",
    inset: 0,
    border: 0,
    background: "transparent",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    zIndex: 999,
  },
};
