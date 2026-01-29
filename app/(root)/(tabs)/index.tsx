import { Link } from "expo-router";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { logout } from "@/lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/app/components/Search";
import { Card, FeaturedCard } from "@/app/components/Cards";
import Filters from "@/app/components/Filters";

export default function Index() {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row">
            <Image source={images.avatar} className="size-12 rounded-full" />
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xs font-rubik text-black-100">Hello </Text>
              <Text className="text-base font-rubikMedium text-black-300">
                {user?.name || "User"}
              </Text>
            </View>
          </View>
          <Image source={icons.bell} className="size-6" />
        </View>
        <Search />
        <View className="my-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubikBold text-black-300">
              Featured
            </Text>
            <TouchableOpacity>
              <Text className="text-base font-rubikBold text-primary-300">
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row gap-5 mt-5">
            <FeaturedCard />
            <FeaturedCard />
            <FeaturedCard />
          </View>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-xl font-rubikBold text-black-300">
            Our Recomendations
          </Text>
          <TouchableOpacity>
            <Text className="text-base font-rubikBold text-primary-300">
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <Filters />
        <View className="flex flex-row gap-5 mt-5">
          <Card />
          <Card />
        </View>
      </View>
    </SafeAreaView>
  );
}
