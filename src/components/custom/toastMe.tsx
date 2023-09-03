import { CrossIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { IconCross } from "../icons/svgIcons";

// Define a TypeScript interface for the props
interface ToastMeProps {
  title: string;
  bgColor: string;
  textColor: string;
}

const ToastMe: React.FC<ToastMeProps> = ({
  title,
  bgColor,
  textColor,
}) => {
  const [showToaster, setShowToaster] = useState(false);

  useEffect(() => {
    // Show the toaster
    setShowToaster(true);

    // Hide the toaster after a certain duration (e.g., 3 seconds)
    const timer = setTimeout(() => {
      setShowToaster(false);
    }, 3000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed right-4 bottom-4 min-w-72 flex flex-row gap-10 items-center justify-between ${bgColor} ${textColor} p-4 rounded-md shadow-lg transition-all transform ${
        showToaster ? "translate-y-0" : "translate-y-20"
      } ease-in-out duration-300`}
    >
      {title}
      <div className="cursor-pointer" onClick={()=>setShowToaster(false)}><IconCross size={24} color={"white"}/></div>
    </div>
  );
};

export default ToastMe;
