import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";

const NuevoContactoInput = ({ contactId, navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
      }}
    >
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="+535 222-22-22"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            placeholderTextColor="rgba(0,0,0,0.3)"
            color="rgba(0,0,0,1)"
            keyboardType="phone-pad"
          />
        )}
        name={contactId}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => {
            navigation.navigate("MultiplesContactosScreen");
          }}
        >
          <Ionicons name="person-add" color="rgba(112, 28, 87, 1)" size={30} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="barcode" color="rgba(112, 28, 87, 1)" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NuevoContactoInput;

const styles = StyleSheet.create({
  input: {
    width: "50%",
    //height: 50,
    //backgroundColor: "rgba(112, 28, 87, 0.1)",
    //borderRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(112, 28, 87, 1)",
    marginBottom: 10,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
});
