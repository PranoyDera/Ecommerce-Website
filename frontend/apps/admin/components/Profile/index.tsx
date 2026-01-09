"use client";
import { motion } from "framer-motion";


type AdminProfileProps = {
  open: boolean;
  name: string | null;
  imageUrl: string;
  onClick: () => void;
};

const Profile = ({ open, name, imageUrl, onClick }: AdminProfileProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
    >
      {/* Profile Image */}
      <img
        src={imageUrl}
        alt="Admin Profile"
        className="h-12 w-12 rounded-full object-cover"
      />

      {/* Text only when sidebar is open */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col text-left"
        >
          <span className="text-xs text-neutral-500">Hi,</span>
          <span className="text-sm font-medium text-black dark:text-white">
            {name}
          </span>
        </motion.div>
      )}
    </button>
  );
};

export default Profile;
