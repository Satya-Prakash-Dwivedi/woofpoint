import { SafeAreaView, Text, View } from "react-native";
import Landing from "./src/screens/Landing";
import Role from "./src/screens/Role";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import OwnerHome from "./src/Owner/HomeOwner";
import UploadPhoto from "./src/screens/UploadPhoto";
import TrainerHome from "./src/Trainer/TrainerHomeScreen";
import EditTrainerProfile from "./src/Trainer/EditTrainerProfile";
import TrainerProfileScreen from "./src/Trainer/TrainerProfile";
import EditOwnerProfile from "./src/Owner/EditOwnerProfile";
import OwnerProfile from "./src/Owner/OwnerProfile";

// Navigation
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Role: undefined;
  OwnerHome: { token: string };
  TrainerHome: { token: string };
  UploadPhoto: { token: string; role: "owner" | "trainer" };
  TrainerProfile: undefined;
  EditTrainerProfile: { token: string };
  EditOwnerProfile: { token: string };
  OwnerProfile: undefined;
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
          name="OwnerHome"
          component={OwnerHome}
          options={{
            title: ""
          }}
        />

        <Stack.Screen
          name="TrainerHome"
          component={TrainerHome}
          options={{
            title: ""
          }}
        />
        <Stack.Screen name="UploadPhoto"
          component={UploadPhoto}
          options={{
            title: ""
          }} />

        <Stack.Screen
          name="EditTrainerProfile"
          component={EditTrainerProfile}
          options={{
            title: "",
            headerShown: false
          }}
        />
        <Stack.Screen
          name="TrainerProfile"
          component={TrainerProfileScreen}
          options={{ headerShown: false }} // hide default header
        />
        <Stack.Screen
          name="EditOwnerProfile"
          component={EditOwnerProfile}
          options={{
            title: "",
            headerShown: false
          }}
        />
        <Stack.Screen
          name="OwnerProfile"
          component={OwnerProfile}
          options={{
            title: "",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default app;