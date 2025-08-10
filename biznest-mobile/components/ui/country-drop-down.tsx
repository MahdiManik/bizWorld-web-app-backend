import React, { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import CountryPicker, {
  Country,
  getAllCountries,
  FlagType,
} from 'react-native-country-picker-modal';
import fonts from '@/constants/fonts';
import colors from '@/constants/colors';
import { AntDesign } from '@expo/vector-icons';

type CountryDropdownProps = {
  onChange: (value: string) => void;
  value: string;
};
export default function CountryDropdown({
  value,
  onChange,
}: CountryDropdownProps) {
  const [visible, setVisible] = useState(false);
  const [_value, setValue] = useState<Country>();

  useEffect(() => {
    const findCountryByCallingCode = async () => {
      if (value) {
        const cleanValue = value.replace('+', '');
        const countries = await getAllCountries(FlagType.FLAT);
        const foundCountry = countries.find(
          (country) =>
            country.callingCode && country.callingCode.includes(cleanValue)
        );
        if (foundCountry) {
          setValue(foundCountry);
        }
      }
    };

    findCountryByCallingCode();
  }, [value]);

  const onSelect = (item: Country) => {
    setValue(item);
    onChange('+' + item.callingCode[0]);
  };

  return (
    <View className="flex-row items-center">
      <CountryPicker
        countryCode={_value?.cca2 || 'SG'}
        preferredCountries={['SG']}
        theme={{
          flagSize: 20,
          fontFamily: fonts.Roboto400,
          fontSize: 14,
          primaryColor: colors.primary,
          filterPlaceholderTextColor: colors.primary,
          onBackgroundTextColor: colors.title,
        }}
        // @ts-ignore
        closeButtonImageStyle={[
          Platform.OS === 'android' ? { width: 16, height: 16 } : {},
        ]}
        closeButtonStyle={{ width: 40, height: 20 }}
        withFlagButton
        visible={visible}
        onClose={() => setVisible(false)}
        filterProps={{
          cursorColor: colors.primary,
          placeholder: 'Search country',
          placeholderTextColor: colors.subtle,
        }}
        withFilter
        withFlag
        withEmoji
        onSelect={onSelect}
      />
      <AntDesign name="caretdown" size={12} color="black" />
    </View>
  );
}
