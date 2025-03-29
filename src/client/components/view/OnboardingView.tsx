import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { DEFAULT_COLOURS } from "../../styles/commonStyles";
import HorizontalRule from "../common/HorizontalRule";
import { Button, Checkbox, Label } from "tamagui";
import CheckMark from "../../assets/icons/CheckMark";
import { useState } from "react";
import { NavigationProps, RouteProps } from "../../types";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import { occupationData } from "../../occupations";
import ManageUserService from "../../services/managerUserService";
import { useUser } from "../../contexts/UserContext";

interface OnboardingViewProps {
  navigation: NavigationProps;
  route: RouteProps;
}

const sexData = [{ sex: "Male" }, { sex: "Female" }];

const OnboardingView = ({ navigation, route }: OnboardingViewProps) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [dob, setDob] = useState(new Date());
  const [occupation, setOccupation] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [fieldsValid, setFieldsValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const { setUser } = useUser();

  const email = route.params?.email;

  const validateSelections = () => {
    const validFirstName = firstName.length >= 2;
    const validLastName = lastName.length >= 2;
    const validOccupation = occupation.length > 0; // also check that its in occupationData
    const validSex =
      sex.toLowerCase() === "female" || sex.toLowerCase() === "male";

    return validFirstName && validLastName && validSex && validOccupation;
  };

  const createAccountHandler = async () => {
    setLoading(true);
    if (!validateSelections()) {
      setFieldsValid(false);
      setLoading(false);
      return;
    }

    setFieldsValid(true);

    try {
      const result = await ManageUserService.createUser({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        dob: dob,
        sex: sex.toLowerCase(),
        email: email,
        occupation: occupation,
      });

      setUser(result[0]);
      setLoading(false);

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Main",
            params: { name: `${firstName} ${lastName}` },
          },
        ],
      });
    } catch (e: any) {
      console.error(e.message);
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.onboardingBox}>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>Please Enter Your Information</Text>
        </View>
        <View style={styles.nameBox}>
          <View style={styles.nameInnerBox}>
            <Text style={styles.fieldText}>
              First name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              placeholder="First Name"
              style={styles.textInput}
              placeholderTextColor={DEFAULT_COLOURS.secondary}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.nameInnerBox}>
            <Text style={styles.fieldText}>Middle name </Text>
            <TextInput
              placeholder="Middle Name"
              style={styles.textInput}
              placeholderTextColor={DEFAULT_COLOURS.secondary}
              value={middleName}
              onChangeText={setMiddleName}
            />
          </View>
          <View style={styles.nameInnerBox}>
            <Text style={styles.fieldText}>
              Last name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              placeholder="Last Name"
              style={styles.textInput}
              placeholderTextColor={DEFAULT_COLOURS.secondary}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <HorizontalRule />

        {/* Replace these with the corresponding dropdowns later */}
        <View style={styles.demographicDataBox}>
          <View style={styles.nameInnerBox}>
            <Text style={styles.fieldText}>
              Sex/gender <Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              style={styles.textInput}
              data={sexData}
              labelField="sex"
              valueField="sex"
              placeholder="Sex/Gender"
              placeholderStyle={{ fontSize: 14 }}
              selectedTextStyle={{ fontSize: 14 }}
              onChange={({ sex }) => setSex(sex)}
              itemTextStyle={{ fontSize: 14 }}
              iconColor="black"
            />
          </View>
          <View style={styles.nameInnerBox}>
            <Text style={styles.fieldText}>
              Date of Birth <Text style={styles.required}>*</Text>
            </Text>
            <DateTimePicker
              style={styles.datePicker}
              value={dob}
              mode="date"
              display="default"
              onChange={(e, date) => setDob(date || dob)}
            />
          </View>
          <View style={styles.nameInnerBox}>
            <Text style={styles.fieldText}>
              Occupation <Text style={styles.required}>*</Text>
            </Text>
            <Dropdown
              style={styles.textInput}
              data={occupationData}
              labelField="occupation"
              valueField="occupation"
              placeholder="Occupation/Industry"
              placeholderStyle={{ fontSize: 14 }}
              selectedTextStyle={{ fontSize: 14 }}
              onChange={({ occupation }) => setOccupation(occupation)}
              itemTextStyle={{ fontSize: 14 }}
              iconColor="black"
              search
            />
          </View>
        </View>

        <View style={styles.checkBox}>
          <Checkbox
            marginRight={12}
            id="check"
            checked={keepLogin}
            onCheckedChange={() => setKeepLogin(!keepLogin)}
          >
            <Checkbox.Indicator>
              <CheckMark size={20} />
            </Checkbox.Indicator>
          </Checkbox>
          <Label size={10} htmlFor="check">
            Stay signed in on this device
          </Label>
        </View>
        {!fieldsValid && (
          <View style={styles.requiredFields}>
            <Text style={{ color: "red" }}>
              Make sure all required fields are filled.
            </Text>
          </View>
        )}

        <Button
          backgroundColor={DEFAULT_COLOURS.primary}
          width={"60%"}
          marginTop={20}
          marginHorizontal={"auto"}
          onPress={createAccountHandler}
        >
          {!loading ? (
            <Text style={{ color: "white" }}>Create Account</Text>
          ) : (
            <ActivityIndicator color={"#fff"} />
          )}
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  onboardingBox: {
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    gap: 16,
  },
  headerBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5%",
    margin: 12,
    position: "relative",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
  },
  fieldText: {
    width: "30%",
  },
  backArrow: {
    position: "absolute",
    left: 12,
  },
  textInput: {
    flex: 1, // Make input take remaining space
    backgroundColor: "#EDEDED",
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
  },
  nameBox: {
    display: "flex",
    alignItems: "center",
    rowGap: 24,
    marginBottom: 12,
  },
  nameInnerBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "80%",
    gap: 10,
    alignItems: "center",
    position: "relative",
  },
  datePicker: {
    justifyContent: "flex-start",
    marginLeft: -10,
  },
  hRule: {
    margin: 12,
  },
  demographicDataBox: {
    display: "flex",
    alignItems: "center",
    rowGap: 24,
    marginVertical: 12,
  },
  checkBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "60%",
    alignSelf: "center",
  },
  required: {
    position: "absolute",
    left: "15%",
    top: "30%",
    color: "red",
  },
  requiredFields: {
    display: "flex",
    alignItems: "center",
  },
});

export default OnboardingView;
