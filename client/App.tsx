import { SafeAreaView, Text, View } from "react-native";
import Landing from "./src/screens/Landing";
import Role from "./src/screens/Role";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";

// Navigation
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Role: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>()

function app() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Landing'>
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{
            title: "Landing Page"
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "Login Page"
          }}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            title: "Signup Page"
          }}
        />

        <Stack.Screen
          name="Role"
          component={Role}
          options={{
            title: "Role Selection Page"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default app;