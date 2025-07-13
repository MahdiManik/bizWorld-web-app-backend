import React from "react";
import { OnboardingStep1FormData } from "../types/type";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { View } from "react-native";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Feather } from "@expo/vector-icons";

function ProfileForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingStep1FormData>();
  console.log(errors);

  /* =================================================
     submit → store form values in context, go to step 2
  ================================================== */
  const onSubmit = (form: OnboardingStep1FormData) => {
    console.log(form);
    router.replace("/onboarding-two");
  };
  return (
    <View>
      <Controller
        control={control}
        name="profileImage"
        render={({ field: { onChange, value } }) => (
          <View>
            <Input
              variant="default"
              type="image"
              value={value}
              onChangeText={onChange}
            />
          </View>
        )}
      />
      <Controller
        control={control}
        name="professionalHeadline"
        rules={{ required: "Professional Headline is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            label="Professional Headline"
            placeholder="Financial Advisor"
            value={value}
            onChangeText={onChange}
            error={error?.message}
            type="text"
            required
          />
        )}
      />
      <Controller
        control={control}
        name="industrySpecialization"
        rules={{ required: "Industry Specialization is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            label="Industry Specialization"
            type="select"
            placeholder="Finance"
            error={error?.message}
            required
          />
        )}
      />
      <Controller
        control={control}
        name="areasOfExpertise"
        rules={{ required: "Areas of Expertise is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            label="Areas of Expertise"
            type="select"
            placeholder="Select expertise"
            error={error?.message}
            required
          />
        )}
      />
      <Controller
        control={control}
        name="portfolioLink"
        rules={{
          required: "Portfolio Link is required",
          pattern: {
            value: /^(http|https):\/\/[^ "]+$/,
            message:
              "Please enter a valid URL starting with http:// or https://",
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            label="Portfolio Link"
            placeholder="https://myportfolio.com"
            value={value}
            onChangeText={onChange}
            error={error?.message}
            required
          />
        )}
      />
      <Controller
        control={control}
        name="whatsappNumber"
        rules={{
          required: "WhatsApp Number is required",
          pattern: {
            value: /^\d+$/,
            message: "Please enter a valid number (digits only)",
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            label="WhatsApp No"
            type="phone"
            placeholder="Phone No (digits only)"
            value={value}
            onChangeText={onChange}
            error={error?.message}
            required
          />
        )}
      />
      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <View>
            <Input label="Upload Document" type="file" value={value} />
          </View>
        )}
        name="uploadedDocument"
      />
      <Controller
        control={control}
        name="introduction"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Introduce Yourself"
            placeholder="Hello! I'm Nathan, a User Experience (UX) Consultant with 5 years of hands-on experience in crafting intuitive and delightful digital experiences. Passionate about merging design and functionality, I..."
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={6}
            inputStyle="h-32 text-top"
          />
        )}
      />
      <Button
        title="Next"
        className="bg-primary flex-row  justify-center rounded-md py-3 items-center mt-6 mb-4"
        onPress={handleSubmit(onSubmit)}
        icon={<Feather name="chevron-right" size={18} color="white" />}
      />
    </View>
  );
}

export default ProfileForm;
