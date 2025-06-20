import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

type TextFieldProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  hasError?: boolean;
  errorText?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export default function TextField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  hasError = false,
  errorText,
  style,
  inputStyle,
}: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedInput,
        hasError && styles.errorInput,
        style,
      ]}>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={Colors.midGray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={24} 
              color={Colors.midGray} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {hasError && errorText && (
        <Text style={styles.errorText}>{errorText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Layout.spacing.sm,
  },
  inputContainer: {
    height: Layout.textFieldHeight,
    borderRadius: Layout.borderRadius,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.midGray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
  },
  focusedInput: {
    borderColor: Colors.primary,
  },
  errorInput: {
    borderColor: Colors.errorRed,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: Typography.sizes.body,
    color: Colors.black,
  },
  eyeIcon: {
    padding: Layout.spacing.xs,
  },
  errorText: {
    color: Colors.errorRed,
    fontSize: Typography.sizes.caption,
    marginTop: 4,
    marginLeft: Layout.spacing.xs,
  },
}); 