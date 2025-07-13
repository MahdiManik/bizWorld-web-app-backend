import OTPVerificationForm from "@/components/Auth/OtpVerification";
import TitleDescription from "@/components/Auth/TitleDescription";

const OtpVerificationPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <TitleDescription
          title="Enter Authentication Code"
          description="Please enter the 4-digit verification code that we have sent via the email. "
        />
        <OTPVerificationForm />
      </div>
    </div>
  );
};

export default OtpVerificationPage;
