import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/ui/header';
import Input from '@/components/ui/input';
import { Entypo, Ionicons } from '@expo/vector-icons';
import NotiIcon from '@/assets/svgs/home/NotiIcon';
import SuggestionsCard from './SuggestionCard';
import { router } from 'expo-router';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import colors from '@/constants/colors';
import { useGetSuggestConsultants } from '../hooks/useConsultant';
import { SuggestConsultant } from '../types/consultant';

const Suggestions = () => {
  const { data } = useGetSuggestConsultants();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.1}
      />
    ),
    []
  );

  const renderSuggestionCard = ({ item }: { item: SuggestConsultant }) => (
    <SuggestionsCard suggestedData={item} />
  );
  return (
    <>
      <SafeAreaView edges={['top']} className="flex-0 bg-primary" />
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        className="flex-1 bg-white"
      >
        <Header
          showBackButton
          title="Suggestions"
          rightComponent={
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => bottomSheetModalRef?.current?.present()}
              >
                <Entypo name="dots-three-horizontal" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <NotiIcon />
              </TouchableOpacity>
            </View>
          }
        />
        <View className="flex-1 p-4">
          <Input
            leftIcon={<Ionicons name="search" size={20} color="#8E8E93" />}
            className="border-0 bg-lightgray"
            placeholder="Search .."
            rightIcon={
              <TouchableOpacity
                onPress={() => {
                  bottomSheetModalRef?.current?.present();
                }}
              >
                <Ionicons name="filter" size={20} color="#8E8E93" />
              </TouchableOpacity>
            }
          />
          <View className="my-3 flex-row items-center justify-between">
            <Text className="font-roboto500 text-base text-subtle">
              {data?.length} Consultants Available
            </Text>
          </View>
          <FlatList
            data={data}
            renderItem={renderSuggestionCard}
            keyExtractor={(item) => item.documentId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
          />
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          backdropComponent={renderBackdrop}
          index={1}
          snapPoints={['15%', '90%']}
        >
          <BottomSheetScrollView>
            <TouchableOpacity
              className="flex-row items-center gap-4 px-6 py-4"
              onPress={() => {
                router.push('/consultants/send-requests');
                bottomSheetModalRef?.current?.dismiss();
              }}
            >
              <View className="flex items-center justify-center rounded-full bg-bd_tech_secondary p-2">
                <Ionicons name="person-add" size={20} color={colors.primary} />
              </View>
              <Text className="font-roboto500 text-base text-title">
                View sent requests
              </Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </SafeAreaView>
    </>
  );
};

export default Suggestions;
