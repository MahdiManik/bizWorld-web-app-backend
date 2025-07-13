import { View } from "react-native";
import React from "react";

const DottedLine = ({ className = "" }: { className?: string }) => {
  return (
    <View
      className={className}
      style={{
        borderRadius: 1,
        borderStyle: "dotted",
        borderWidth: 1,
        borderColor: "gray",
      }}
    />
  );
};

export default DottedLine;
