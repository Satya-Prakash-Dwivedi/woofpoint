import { SafeAreaView, Text, View } from "react-native";
import Landing from "./src/screens/Landing";
import Role from "./src/screens/Role";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import HomeScreen from "./src/screens/HomeOwner";
import UploadPhoto from "./src/screens/UploadPhoto";

// Navigation
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Role: undefined;
  HomeScreen: undefined;
  UploadPhoto: { token: string };
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
            title: ""
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: ""
          }}
        />

        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            title: ""
          }}
        />

        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: ""
          }}
        />
        <Stack.Screen name="UploadPhoto"
          component={UploadPhoto}
          options={{
            title: ""
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default app;