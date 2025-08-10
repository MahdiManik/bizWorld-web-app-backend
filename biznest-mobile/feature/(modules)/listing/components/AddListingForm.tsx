import { ScrollView } from 'react-native';
import React, { useState } from 'react';
import { ProgressBar } from 'react-native-paper';
import { FormProvider, useForm } from 'react-hook-form';
import {
  AddListingFormData,
  addListingFormSchema,
} from '../types/add-listing.types';
import colors from '@/constants/colors';
import AddListingStep1 from './AddListingStep1';
import AddListingStep2 from './AddListingStep2';
import AddListingStep3 from './AddListingStep3';
import { zodResolver } from '@hookform/resolvers/zod';
import { fileUpload } from '@/lib/fileUpload';
import { CreateListing } from '../types/create-listing';
import { useCreateListing, useEditListing } from '../hooks/useListing';
import { ListingDetailResponse } from '../types/listing-detail';
import useSession from '@/store/session';

interface AddListingFormProps {
  type: 'create' | 'edit';
  editData?: ListingDetailResponse;
}
const AddListingForm = ({ type, editData }: AddListingFormProps) => {
  const [step, setStep] = useState<number>(1);
  const { mutateAsync, isPending: createLoading } = useCreateListing();
  const { mutateAsync: editAsync, isPending: editLoading } = useEditListing();
  const { user } = useSession();
  const documentId = user?.documentId || user?.id || '';
  const methods = useForm<AddListingFormData>({
    resolver: zodResolver(addListingFormSchema),
    mode: 'onChange',
    defaultValues:
      type === 'edit' && editData?.data
        ? {
            step1: {
              title: editData.data.title,
              location: editData.data.country,
              category: editData.data.category,
              thumbnail: editData.data.image?.url || '',
              isPrivate: false,
              askingPrice: editData.data.askingPrice?.toString() || '',
              equityOffered: editData.data.equityOffered?.toString() || '',
              annualRevenue: editData.data.annualRevenue?.toString() || '',
              profitMargin: editData.data.profitMargin?.toString() || '',
              growthRate: editData.data.growthRate?.toString() || '',
            },
            step2: {
              jan: editData.data.revenueBreakDown?.Jan || '',
              feb: editData.data.revenueBreakDown?.Feb || '',
              mar: editData.data.revenueBreakDown?.Mar || '',
              apr: editData.data.revenueBreakDown?.Apr || '',
              may: editData.data.revenueBreakDown?.May || '',
              jun: editData.data.revenueBreakDown?.Jun || '',
              jul: editData.data.revenueBreakDown?.Jul || '',
              aug: editData.data.revenueBreakDown?.Aug || '',
              sep: editData.data.revenueBreakDown?.Sep || '',
              oct: editData.data.revenueBreakDown?.Oct || '',
              nov: editData.data.revenueBreakDown?.Nov || '',
              dec: editData.data.revenueBreakDown?.Dec || '',
              ebitda: editData.data.revenueBreakDown?.EBITDA || '',
            },
            step3: {
              documents:
                editData.data.document?.map((doc) => ({
                  uri: doc.url,
                  name: doc.name,
                  mimeType: doc.mime,
                  id: doc.id,
                })) || [],
            },
          }
        : {
            step1: {
              title: '',
              location: '',
              category: '',
              thumbnail: '',
              isPrivate: false,
              askingPrice: '',
              equityOffered: '',
              annualRevenue: '',
              profitMargin: '',
              growthRate: '',
            },
            step2: {
              jan: '',
              feb: '',
              mar: '',
              apr: '',
              may: '',
              jun: '',
              jul: '',
              aug: '',
              sep: '',
              oct: '',
              nov: '',
              dec: '',
              ebitda: '',
            },
            step3: {
              documents: [],
            },
          },
  });

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await methods.trigger('step1');
    } else if (step === 2) {
      isValid = await methods.trigger('step2');
    }

    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async () => {
    if (editLoading || createLoading) {
      return;
    }
    const isStep3Valid = await methods.trigger('step3');
    if (isStep3Valid) {
      const data = methods.getValues();
      if (type === 'create') {
        try {
          // Upload thumbnail if exists
          let thumbnailId = null;
          if (data.step1.thumbnail) {
            const thumbnail =
              typeof data.step1.thumbnail === 'string'
                ? {
                    uri: data.step1.thumbnail,
                    name: 'thumbnail.jpg',
                    mimeType: 'image/jpeg',
                  }
                : data.step1.thumbnail;

            thumbnailId = await fileUpload({
              uri: thumbnail.uri,
              name: thumbnail.name || 'thumbnail.jpg',
              type: thumbnail.mimeType || 'image/jpeg',
            });
          }

          // Upload documents if exist
          let documentIds: number[] = [];
          if (data.step3.documents && data.step3.documents.length > 0) {
            const uploadPromises = data.step3.documents.map((doc) =>
              fileUpload({
                uri: doc.uri,
                name: doc.name,
                type: doc.mimeType || 'application/octet-stream',
              })
            );
            const uploadResults = await Promise.all(uploadPromises);
            documentIds = uploadResults
              .filter((id) => id !== null)
              .map((doc) => doc);
          }

          // Format data according to required structure
          const formattedData: CreateListing = {
            title: data.step1.title,
            askingPrice: `$${data.step1.askingPrice}`,
            category: data.step1.category,
            country: data.step1.location,
            image: thumbnailId,
            description: data.step1.title, // Using title as description for now
            equityOffered: `${data.step1.equityOffered}%`,
            employees: '10-20', // Default value
            established: '2018', // Default value
            businessOwner: documentId?.toString(), // Default value
            listingStatus: 'PENDING',
            annualRevenue: data.step1.annualRevenue,
            profitMargin: data.step1.profitMargin,
            growthRate: data.step1.growthRate,
            revenueBreakDown: {
              Jan: data.step2.jan,
              Feb: data.step2.feb,
              Mar: data.step2.mar,
              Apr: data.step2.apr,
              May: data.step2.may,
              Jun: data.step2.jun,
              Jul: data.step2.jul,
              Aug: data.step2.aug,
              Sep: data.step2.sep,
              Oct: data.step2.oct,
              Nov: data.step2.nov,
              Dec: data.step2.dec,
              EBITDA: data.step2.ebitda,
            },
            document: documentIds,
          };

          await mutateAsync(formattedData);
        } catch (error) {
          console.error('Error processing form submission:', error);
        }
      } else if (type === 'edit') {
        try {
          // Handle thumbnail upload or preserve existing
          let thumbnailId = editData?.data?.image?.id || null;
          if (
            data.step1.thumbnail &&
            data.step1.thumbnail !== editData?.data?.image?.url
          ) {
            const thumbnail =
              typeof data.step1.thumbnail === 'string'
                ? {
                    uri: data.step1.thumbnail,
                    name: 'thumbnail.jpg',
                    mimeType: 'image/jpeg',
                  }
                : data.step1.thumbnail;

            thumbnailId = await fileUpload({
              uri: thumbnail.uri,
              name: thumbnail.name || 'thumbnail.jpg',
              type: thumbnail.mimeType || 'image/jpeg',
            });
          }

          // Handle documents upload or preserve existing
          let documentIds: number[] = [];
          if (data.step3.documents && data.step3.documents.length > 0) {
            const documentPromises = data.step3.documents.map(async (doc) => {
              if (doc.id) {
                return doc.id;
              }

              return await fileUpload({
                uri: doc.uri,
                name: doc.name,
                type: doc.mimeType || 'application/octet-stream',
              });
            });
            const uploadResults = await Promise.all(documentPromises);
            documentIds = uploadResults
              .filter((id: number | null): id is number => id !== null)
              .map((doc: number) => doc);
          }

          const formattedData: CreateListing = {
            title: data.step1.title,
            askingPrice: `$${data.step1.askingPrice}`,
            category: data.step1.category,
            country: data.step1.location,
            image: thumbnailId || 0,
            description: data.step1.title,
            equityOffered: `${data.step1.equityOffered}%`,
            employees: editData?.data?.employees || '10-20',
            established: editData?.data?.established || '2018',
            businessOwner:
              editData?.data?.businessOwner?.documentId?.toString() || '',
            listingStatus: editData?.data?.listingStatus || 'PENDING',
            annualRevenue: data.step1.annualRevenue,
            profitMargin: data.step1.profitMargin,
            growthRate: data.step1.growthRate,
            revenueBreakDown: {
              Jan: data.step2.jan,
              Feb: data.step2.feb,
              Mar: data.step2.mar,
              Apr: data.step2.apr,
              May: data.step2.may,
              Jun: data.step2.jun,
              Jul: data.step2.jul,
              Aug: data.step2.aug,
              Sep: data.step2.sep,
              Oct: data.step2.oct,
              Nov: data.step2.nov,
              Dec: data.step2.dec,
              EBITDA: data.step2.ebitda,
            },
            document: documentIds,
          };

          await editAsync({
            id: editData?.data?.documentId || '',
            edit: formattedData,
          });
        } catch (error) {
          console.error('Error processing edit form submission:', error);
        }
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <ScrollView
        className="h-full w-full px-4"
        showsVerticalScrollIndicator={false}
      >
        <ProgressBar
          progress={step === 1 ? 0.33 : step === 2 ? 0.67 : 1}
          color={colors.primary}
          style={{
            borderRadius: 10,
            height: 8,
            backgroundColor: colors.stroke.border,
            marginBottom: 16,
          }}
        />
        {step === 1 ? (
          <AddListingStep1 onNext={nextStep} />
        ) : step === 2 ? (
          <AddListingStep2 onNext={nextStep} onPrev={prevStep} />
        ) : (
          <AddListingStep3 onSubmit={onSubmit} onPrev={prevStep} />
        )}
      </ScrollView>
    </FormProvider>
  );
};

export default AddListingForm;
