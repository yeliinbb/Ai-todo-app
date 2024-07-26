import { useState } from "react";
import Modal from "react-modal";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: { title: string; description: string; date: string }) => void;
  initialDate: string;
}
