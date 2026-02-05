import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Search from "@/app/components/Search";
import { Card } from "@/app/components/Cards";
import Filters from "@/app/components/Filters";
import { router, useLocalSearchParams } from "expo-router";
import { useAppwrite } from "@/lib/useAppwrite";
import { getProperties } from "@/lib/appwrite";
import { useEffect } from "react";
import NoResult from "@/app/components/NoResult";
import icons from "@/constants/icons";

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  // 2. Main Properties List - Setup with initial state
  const {
    data: properties,
    loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter || "All",
      query: params.query || "",
      limit: 20,
    },
    skip: true, // We skip initial auto-run to control it via useEffect
  });

  // 3. Only refetch when the actual SEARCH or FILTER values change
  useEffect(() => {
    refetch({
      filter: params.filter || "All",
      query: params.query || "",
      limit: 20,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card item={item as any} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResult />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5 ">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <Text className="text-base mr-2 text-center font-rubikMedium text-black-30">
                Search for your Ideal Home
              </Text>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>
            <Search />
            <View className="mt-5">
              <Text className="text-xl font-rubikBold text-black-300 mt-5">
                Found {properties?.length || 0} properties
              </Text>
              <Filters />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
