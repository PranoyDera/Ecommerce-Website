import { ChangePasswordForm } from "../../../components/changePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black w-[95%] mx-auto my-4 bg-[url('/userpage.jpg')] bg-center bg-cover rounded-3xl">
      <ChangePasswordForm />
    </div>
  );
}
