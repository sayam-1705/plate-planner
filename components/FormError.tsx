import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

interface FormErrorProps {
  message?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 mt-3 text-sm text-red-500 bg-red-50 rounded-md">
      <ExclamationCircleIcon className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
