import LoginForm from "@/components/Auth/Login";
import TitleDescription from "@/components/Auth/TitleDescription";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <TitleDescription
          title="Welcome"
          description="Please Log In To Access Your Admin Dashboard And Manage User Subscriptions, Business Verifications, And Investor Approvals."
        />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
