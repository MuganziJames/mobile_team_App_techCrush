import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { useRef, useState } from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';

type OTPInputProps = {
  length: number;
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

export default function OTPInput({ length, value, onChange, style }: OTPInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [isFocused, setIsFocused] = useState<number>(-1);

  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;
    
    const newOtp = newValue.join('');
    onChange(newOtp);
    
    // Move to next input if this one is filled
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input if backspace is pressed and the input is empty
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length }).map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.inputContainer,
            isFocused === index && styles.focusedInput,
          ]}
        >
          <TextInput
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            value={value[index] || ''}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => setIsFocused(index)}
            onBlur={() => setIsFocused(-1)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: Layout.otpBoxSize,
    height: Layout.otpBoxSize,
    borderWidth: 1,
    borderColor: Colors.midGray,
    borderRadius: Layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  focusedInput: {
    borderColor: Colors.primary,
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: Typography.sizes.h1,
    fontWeight: "500",
    color: Colors.black,
    textAlign: 'center',
  },
}); 