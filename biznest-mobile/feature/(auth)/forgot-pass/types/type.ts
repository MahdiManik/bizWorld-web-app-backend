import { z } from "zod";
import { forgotPasswordSchema } from "../components/ForgetPassForm";

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
