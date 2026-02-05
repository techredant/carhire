import { View, TextInput, Button, Text, Alert } from "react-native";
import { useState } from "react";

export default function CreateUserScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = "https://carhire-one.vercel.app/";


  const submit = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "Both fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/users/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Failed");
        return;
      }

      Alert.alert("Success", data.message);
      setFirstName("");
      setLastName("");
    } catch (err) {
      Alert.alert("Network Error", "Could not reach server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title={loading ? "Saving..." : "Submit"} onPress={submit} />
    </View>
  );
}
