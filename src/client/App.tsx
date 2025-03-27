import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MyExpenses from "./components/view/MyExpenses";
import MyBudget from "./components/view/MyBudget";
import LoginView from "./components/view/LoginView";
import RegisterView from "./components/view/RegisterView";
import ResetPasswordView from "./components/view/ResetPasswordView";
import ManagePage from "./components/view/ManagePage";
import AddExpenseView from "./components/view/AddExpenseView";
import OnboardingView from "./components/view/OnboardingView";

import { TamaguiProvider } from "tamagui";
import config from "./tamagui.config";
import { View, StyleSheet } from "react-native";
import AddIcon from "./assets/icons/AddIcon";
import HomeIcon from "./assets/icons/HomeIcon";
import ProfileIcon from "./assets/icons/ProfileIcon";
import HomePage from "./components/view/HomePage";
import ProfilePage from "./components/view/ProfilePage";
import BudgetBoxDetails from "./components/common/BudgetBoxDetails";
import DefaultLayout from "./components/common/DefaultLayout";
import { UserProvider } from "./contexts/UserContext";
import Toast from "react-native-toast-message";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack to manage pages that are navigatable from the Manage page (expenses, income, budget)
const ManageStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Manage" component={ManagePage} />
      <Stack.Screen name="MyExpenses">
        {({ navigation }) => (
          <DefaultLayout>
            <MyExpenses navigation={navigation} />
          </DefaultLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="MyBudget">
        {({ navigation }) => (
          <DefaultLayout>
            <MyBudget navigation={navigation} />
          </DefaultLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="NewExpense">
        {({ navigation, route }) => (
          <DefaultLayout>
            <AddExpenseView
              navigation={navigation}
              params={route?.params || null}
            />
          </DefaultLayout>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="BudgetBoxDetails" component={BudgetBoxDetails} />
    </Stack.Navigator>
  );
};

const Navbar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.bottomNav,
        tabBarActiveTintColor: "#9E599A",
        tabBarInactiveTintColor: "#9F9F9F",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Manage"
        component={ManageStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AddIcon size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </TamaguiProvider>
  );
}

const MainApp = () => {
  return (
    <UserProvider>
      <View style={styles.app}>
        <Toast />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Authentication Screens */}
          <Stack.Screen name="Login" component={LoginView} />
          <Stack.Screen name="ResetPassword">
            {(props: any) => (
              <DefaultLayout>
                <ResetPasswordView {...props} />
              </DefaultLayout>
            )}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterView} />
          <Stack.Screen name="Onboarding">
            {(props: any) => (
              <DefaultLayout>
                <OnboardingView {...props} />
              </DefaultLayout>
            )}
          </Stack.Screen>

          {/* Main App */}
          <Stack.Screen name="Main" component={Navbar} />
        </Stack.Navigator>
      </View>
    </UserProvider>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "white",
  },
  bottomNav: {
    paddingTop: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    height: 80,
  },
});
