import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useGlobalContext } from "@/lib/global-provider";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import Search from "@/app/components/Search";
import { Card, FeaturedCard } from "@/app/components/Cards";
import Filters from "@/app/components/Filters";
import { router, useLocalSearchParams } from "expo-router";
import { useAppwrite } from "@/lib/useAppwrite";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useEffect } from "react";
import NoResult from "@/app/components/NoResult";

export default function Index() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  // 1. Fetch Latest Properties (Featured)
  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({
      fn: getLatestProperties,
    });

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
      limit: 6,
    },
    skip: true, // We skip initial auto-run to control it via useEffect
  });

  // 3. Only refetch when the actual SEARCH or FILTER values change
  useEffect(() => {
    refetch({
      filter: params.filter || "All",
      query: params.query || "",
      limit: 6,
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
            <View className="flex flex-row items-center justify-between mt-5">
              <View className="flex flex-row items-center">
                <Image
                  source={user?.avatar ? { uri: user.avatar } : images.avatar}
                  className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">
                    Hello
                  </Text>
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

              {latestPropertiesLoading ? (
                <ActivityIndicator
                  size="large"
                  className="text-primary-300 mt-5"
                />
              ) : (
                <FlatList
                  data={latestProperties}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item as any}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}
            </View>

            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubikBold text-black-300">
                Our Recommendations
              </Text>
              <TouchableOpacity>
                <Text className="text-base font-rubikBold text-primary-300">
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <Filters />
          </View>
        }
      />
    </SafeAreaView>
  );
}
