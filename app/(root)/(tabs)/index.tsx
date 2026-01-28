import { Link } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { logout } from "@/lib/appwrite";

export default function Index() {
  const { user } = useGlobalContext();

  const handleLogout = async () => {
    await logout();
    // The AppLayout will redirect to sign-in page
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-3xl text-black-300 font-bold italic my-10 font-rubik">
        Welcome to RealState
      </Text>

      {user && <Text className="text-lg mb-4">Welcome back, {user.name}!</Text>}

      <View className="my-5 flex flex-col gap-4">
        <Link href="/(root)/(tabs)/explore" asChild>
          <TouchableOpacity className="bg-primary-300 px-6 py-3 rounded-lg">
            <Text className="text-white font-rubikMedium">Go to Explore</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(root)/(tabs)/profile" asChild>
          <TouchableOpacity className="bg-gray-200 px-6 py-3 rounded-lg">
            <Text className="text-black font-rubikMedium">Go to Profile</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 px-6 py-3 rounded-lg mt-8"
        >
          <Text className="text-white font-rubikMedium">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
