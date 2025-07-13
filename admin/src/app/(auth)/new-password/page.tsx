import NewPasswordForm from "@/components/Auth/NewPassword";
import TitleDescription from "@/components/Auth/TitleDescription";

const NewPasswordPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <TitleDescription
          title="Create New Password"
          description="Enter new a new password . It must be min. 8 characters with a combinations of letters & numbers"
        />
        <NewPasswordForm />
      </div>
    </div>
  );
};

export default NewPasswordPage;
