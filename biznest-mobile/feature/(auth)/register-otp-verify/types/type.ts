export type OTPInputProps = {
  length?: number;
  onComplete: (otp: string) => void;
  error?: string;
};
