import EditUserSubscription from "@/components/AdminDashboard/Subscriptions/EditUserSubscription";
import { Suspense } from "react";

const EditUserSubscriptionPage = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading subscription details...</div>}>
      <EditUserSubscription />
    </Suspense>
  );
};

export default EditUserSubscriptionPage;
