import { SafeAreaView, Text, View } from "react-native";
import Landing from "./src/screens/Landing";
import Role from "./src/screens/Role";
import Login from "./src/screens/Login";
import SignupScreen from "./src/screens/Signup";

function app() {
  return (
    <SafeAreaView>
      <View>
        < Login />
      </View>
    </SafeAreaView>
  )
}

export default app;