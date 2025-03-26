import { CheckCircleIcon } from "@heroicons/react/24/outline";
import React from "react";

interface FormSuccessProps {
  message?: string;
}

const FormSuccess: React.FC<FormSuccessProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 mt-3 text-sm text-green-500 bg-green-50 rounded-md">
      <CheckCircleIcon className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
