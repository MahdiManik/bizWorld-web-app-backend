import { View, Text } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '@/constants/colors';
import Button from '@/components/ui/button';
import { ListingDetail } from '../types/listing-detail';
import { useGetMe } from '@/feature/(auth)/hooks/useAuth';
import PDFIcon from '@/assets/svgs/listing/PDFIcon';
import { useCreateInvestorListing } from '../hooks/useListing';
import useSession from '@/store/session';

interface ListingDocumentsProps {
  listing?: ListingDetail;
  isMylisting: string;
}
const ListingDocuments = ({ listing, isMylisting }: ListingDocumentsProps) => {
  const { data: me } = useGetMe();
  const { user } = useSession();
  const documentId = user?.documentId?.toString() || user?.id.toString() || '';

  const investorStatus = me?.data?.investerStatus;
  const isAlreadyInvested = listing?.interest_listings?.some(
    (interest) => interest?.interestedUsers?.documentId === documentId
  );
  const { mutateAsync } = useCreateInvestorListing();
  const handleInterest = async () => {
    if (investorStatus === 'INVESTER') {
      await mutateAsync({
        businessOwner: listing?.businessOwner?.documentId?.toString() || '',
        interestedUsers: documentId,
        investStatus: 'Pending',
        listing: listing?.documentId?.toString() || '',
      });
    } else {
      router.push({
        pathname: '/(modal)/investor-access',
        params: {
          businessOwner: listing?.businessOwner?.documentId,
          listing: listing?.documentId,
        },
      });
    }
  };
  return (
    <View className="flex-1 gap-4">
      <Text className="font-roboto600 text-base text-title">
        Business Documents
      </Text>
      {(investorStatus === 'INVESTER' && isAlreadyInvested) ||
      isMylisting == 'true' ? (
        <>
          {listing?.document?.map((doc) => (
            <View
              key={doc.id}
              className="flex-row gap-4 rounded-lg border border-stroke-border px-4 py-2"
            >
              <PDFIcon />
              <View className="gap-1">
                <Text className="text-sm font-semibold">{doc.name}</Text>
                <Text className="text-xs text-placeholder">{doc.size}KB</Text>
              </View>
            </View>
          ))}
        </>
      ) : (
        <>
          <Text className="font-roboto400 text-base text-title">
            Express interest to access business documents
          </Text>

          <View className="my-10 flex flex-row justify-center">
            <AntDesign
              name="filetext1"
              size={60}
              color={colors.stroke.border}
            />
          </View>
          <Text className="text-center font-roboto600 text-base text-title">
            Documents are locked
          </Text>
          <Text className="text-center font-roboto400 text-base text-title">
            Express your interest and get approved by the business owner to
            access documents.
          </Text>
          <Button
            title="Interest"
            onPress={handleInterest}
            fullWidth
            className="my-4"
            disabled={isAlreadyInvested}
          />
        </>
      )}
    </View>
  );
};

export default ListingDocuments;
