import React from "react";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();

  // Show loading spinner
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator color="#0061ff" size="large" />
      </View>
    );
  }

  // If not logged in, redirect to sign-in page
  if (!isLogged && !loading) {
    console.log("Not logged in, redirecting to sign-in...");
    return <Redirect href="/sign-in" />;
  }

  // Only show protected content if logged in
  return <Slot />;
}
