import ForgotPasswordForm from "@/components/Auth/ForgotPassword";
import TitleDescription from "@/components/Auth/TitleDescription";

const ForgotPasswordPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <TitleDescription
          title="Forgot your Password?"
          description="Enter your email address, and we’ll send you a verification code to reset your password.."
        />
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
