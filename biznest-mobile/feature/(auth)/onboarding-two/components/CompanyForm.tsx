import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { CompanyFormData } from "../types/types";

function CompanyForm() {
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<CompanyFormData>({
    mode: "onChange",
  });

  const onSubmit = async (formData: CompanyFormData) => {
    try {
      console.log(formData);
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  const handleImageEdit = () => {
    console.log("Edit image pressed");
  };

  return (
    <View>
      <Input type="image" />

      <Controller
        control={control}
        rules={{
          required: "Company name is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Company Name"
            placeholder="Enter company name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={formErrors.name?.message}
            required
          />
        )}
        name="name"
      />

      <View className="mb-4">
        <Text className="text-gray-800 font-medium mb-2">
          Company Status <Text className="text-red-500">*</Text>
        </Text>
        <Controller
          control={control}
          rules={{ required: "Company status is required" }}
          render={({ field: { onChange, value } }) => (
            <Input type="radio" error={formErrors.status?.message} />
          )}
          name="status"
        />
      </View>

      <Controller
        control={control}
        name="industry"
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
        rules={{
          required: "Location is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Location"
            placeholder="Enter company location"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            required
          />
        )}
        name="location"
      />

      <Controller
        control={control}
        rules={{
          required: "Company size is required",
          pattern: {
            value: /^\d+$/,
            message: "Please enter a valid number",
          },
          validate: (value) => {
            const stringValue = typeof value === "string" ? value : "0";
            return (
              parseInt(stringValue || "0", 10) > 0 ||
              "Company size must be greater than 0"
            );
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Company Size"
            placeholder="Enter number of employees (e.g., 10)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="numeric"
            required
          />
        )}
        name="size"
      />

      <Controller
        control={control}
        rules={{
          required: "Revenue is required",
          pattern: {
            value: /^\d+(\.\d+)?$/,
            message: "Please enter a valid number",
          },
          validate: (value) =>
            parseFloat(value || "0") >= 0 || "Revenue cannot be negative",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Revenue"
            placeholder="Enter annual revenue (numbers only)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="numeric"
            required
          />
        )}
        name="revenue"
      />

      <Controller
        control={control}
        render={({ field: { value } }) => (
          <View>
            <Input label="Upload Document" type="file" />

            <View className="flex-row justify-between items-center">
              <Text
                className="text-xs text-gray-500 mt-1 flex-1"
                numberOfLines={1}
              ></Text>
              <Button
                className="p-1 mt-1"
                title="Change"
                onPress={handleImageEdit}
              />
            </View>
          </View>
        )}
        name="companyDocument"
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Description"
            placeholder="Enter description"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={8}
            inputStyle="h-40 text-top"
          />
        )}
        name="description"
      />

      <Button
        className="rounded-md py-3 items-center mt-6 mb-4"
        onPress={handleSubmit(onSubmit)}
        title="Confirm"
      />
    </View>
  );
}

export default CompanyForm;
