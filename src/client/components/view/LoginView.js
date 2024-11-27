import React, { useState } from "react";
import { StyleSheet, View, Image, TextInput } from "react-native";
import { commonStyles, DEFAULT_COLOURS } from "../../styles/commonStyles";
import { Button, Text } from "tamagui";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import MicrosoftIcon from "../../assets/icons/MicrosoftIcon";
import AppleIcon from "../../assets/icons/AppleIcon";

const LoginView = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);

  // TODO: add other login methods
  const handleLogin = (loginMethod) => {
    setIncorrectCredentials(false);
    if (username && password) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Overview", params: { name: username } }],
      });
    } else {
      setIncorrectCredentials(true);
    }
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>{"Login to Plutos"}</Text>
      <View style={styles.loginContainer}>
        <TextInput
          placeholder="Email/Phone Number"
          style={commonStyles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={DEFAULT_COLOURS.secondary}
        />
        <TextInput
          placeholder="Password"
          style={commonStyles.input}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={true}
          placeholderTextColor={DEFAULT_COLOURS.secondary}
        />
      </View>

      <Button
        backgroundColor={DEFAULT_COLOURS.primary}
        marginTop={20}
        paddingHorizontal="20%"
        onPress={() => handleLogin("credentials")}
      >
        <Text fontWeight="500" color="white">
          Continue
        </Text>
      </Button>

      {incorrectCredentials && (
        <Text style={commonStyles.errorText}>Incorrect credentials</Text>
      )}

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <View>
          <Text paddingHorizontal={30}>or</Text>
        </View>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.loginContainer}>
        <View style={styles.alternateSignInContainer}>
          <GoogleIcon size={30} style={{ marginTop: 15, marginRight: 15 }} />
          <Button flex={1} marginTop={15}>
            <Text fontWeight="bold">Continue with Google</Text>
          </Button>
        </View>

        <View style={styles.alternateSignInContainer}>
          <MicrosoftIcon size={33} style={{ marginTop: 15, marginRight: 12 }} />
          <Button flex={1} marginTop={15}>
            <Text fontWeight="bold">Continue with Microsoft</Text>
          </Button>
        </View>

        <View style={styles.alternateSignInContainer}>
          <AppleIcon size={36} style={{ marginTop: 15, marginRight: 10 }} />
          <Button flex={1} marginTop={15}>
            <Text fontWeight="bold">Continue with Apple</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    marginTop: 15,
    display: "block",
    backgroundColor: "#fff",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    marginLeft: 50,
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
});

export default LoginView;
