import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { commonStyles, DEFAULT_COLOURS } from "../../styles/commonStyles";
import { Button, Text } from "tamagui";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";
import { NavigationProps } from "../../types";
import { AuthErrorCode, errorMessages } from "../../enums";

interface RegisterViewProps {
  navigation: NavigationProps;
  route: any;
}

const RegisterView = ({ navigation, route }: RegisterViewProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");
  const [passwordCriteriaStatus, setPasswordCriteriaStatus] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
  });

  const validatePasswordCriteria = (password: string) => {
    const minLength = password.length >= 8;
    const lowercase = /[a-z]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordCriteriaStatus({
      minLength,
      lowercase,
      uppercase,
      specialChar,
    });
  };

  const createAccountHandler = async () => {
    try {
      if (password !== confirmPassword) {
        const error = new Error("Passwords do not match.");
        /* We can directly do error.code = "password-mismatch" but typescript will complain */
        Object.assign(error, { code: "password-mismatch" });
        throw error;
      }

      const status = await validatePassword(auth, password);

      const {
        containsLowercaseLetter,
        containsUppercaseLetter,
        containsNonAlphanumericCharacter,
        meetsMinPasswordLength,
      } = status;

      if (
        meetsMinPasswordLength &&
        containsLowercaseLetter &&
        containsUppercaseLetter &&
        containsNonAlphanumericCharacter
      ) {
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        setRegisterErrorMessage("");
        navigation.reset({
          index: 0,
          /* Probably link a name attribute eventually */
          routes: [
            {
              name: "Onboarding",
              params: {
                email: email,
              },
            },
          ],
        });
      } else {
        throw new Error("Password doesn't meet the criteria.");
      }
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;

      switch (errorCode) {
        case AuthErrorCode.InvalidEmail:
          setRegisterErrorMessage(errorMessages[AuthErrorCode.InvalidEmail]);
          break;
        case AuthErrorCode.EmailAlreadyInUse:
          setRegisterErrorMessage(
            errorMessages[AuthErrorCode.EmailAlreadyInUse],
          );
          break;
        case AuthErrorCode.MissingPassword:
          setRegisterErrorMessage(errorMessages[AuthErrorCode.MissingPassword]);
          break;
        case AuthErrorCode.PasswordDoesNotMeetRequirements:
          setRegisterErrorMessage(
            errorMessages[AuthErrorCode.PasswordDoesNotMeetRequirements],
          );
          break;
        case AuthErrorCode.PasswordMismatch:
          setRegisterErrorMessage(
            errorMessages[AuthErrorCode.PasswordMismatch](errorMessage),
          );
          break;

        default:
          setRegisterErrorMessage(errorMessages.default);
          break;
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={commonStyles.container}>
        <Text style={commonStyles.header}>{"Sign Up for Plutos"}</Text>
        <View style={styles.registerContainer}>
          <TextInput
            placeholder="Email"
            style={commonStyles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor={DEFAULT_COLOURS.secondary}
          />
          <TextInput
            placeholder="Enter Password"
            style={commonStyles.input}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePasswordCriteria(text);
            }}
            secureTextEntry={!showPassword}
            placeholderTextColor={DEFAULT_COLOURS.secondary}
          />
          <TextInput
            placeholder="Confirm Password"
            style={commonStyles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            placeholderTextColor={DEFAULT_COLOURS.secondary}
          />
          {/* Note: Checked the length instead of just using the 'registerErrorMessage' boolean condition since when the component
		compiles, it will be treated as plain text and React Native complains if you put plain text in a View node without a Text
		Node. Doing registerErrorMessage.length && <Text>some text lol</Text> will cause errors
		*/}
          {registerErrorMessage.length !== 0 && (
            <Text style={{ color: "red" }}>{registerErrorMessage}</Text>
          )}

          {/* We can change this up later with a checkbox or like an eye icon */}
          <Pressable
            style={styles.showPassword}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={{ display: "flex", alignItems: "center" }}>
              {showPassword ? "Hide" : "Show"} Password
            </Text>
          </Pressable>
        </View>

        {/* conditionally render this block if user's password doesn't meet firebase password criteria or smth */}
        <View>
          <Text style={styles.passwordCriteriaText}>Password Criteria</Text>
          <View>
            <Text
              style={{
                ...styles.passwordCriteria,
                color: passwordCriteriaStatus.minLength ? "green" : "red",
              }}
            >
              Minimum 8 characters
            </Text>
            <Text
              style={{
                ...styles.passwordCriteria,
                color: passwordCriteriaStatus.lowercase ? "green" : "red",
              }}
            >
              One lowercase character
            </Text>
            <Text
              style={{
                ...styles.passwordCriteria,
                color: passwordCriteriaStatus.uppercase ? "green" : "red",
              }}
            >
              One uppercase character
            </Text>
            <Text
              style={{
                ...styles.passwordCriteria,
                color: passwordCriteriaStatus.specialChar ? "green" : "red",
              }}
            >
              One special character [!,@,#,$,%,..]
            </Text>
          </View>
        </View>

        <View style={styles.createPasswordBox}>
          <Button
            backgroundColor={DEFAULT_COLOURS.primary}
            marginTop={20}
            paddingHorizontal="20%"
            onPress={createAccountHandler}
          >
            <Text fontWeight="500" color="white">
              Continue
            </Text>
          </Button>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
        </View>
        <Pressable
          style={{ margin: 16 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ textDecorationLine: "underline", color: "green" }}>
            {"Already have an account? Log in!"}
          </Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    marginTop: 15,
    display: "flex",
    backgroundColor: "#fff",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    width: "80%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  alternateSignInContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    justifyContent: "flex-start",
    marginTop: 5,
    marginBottom: 5,
  },
  createPasswordBox: {
    width: "60%",
    height: "5%",
    textAlign: "center",
    fontSize: 20,
    margin: 16,
    display: "flex",
    justifyContent: "center",
  },
  passwordCriteriaText: {
    fontSize: 20,
    color: "red",
    margin: 16,
  },
  passwordCriteria: {
    margin: 0,
  },
  showPassword: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default RegisterView;
