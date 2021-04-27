import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { login } from "../context/Actions/actions";
import { actionTypes } from "../context/Actions/types";
import { GlobalContext } from "../context/GlobalProvider";

import { useForm, Controller } from "react-hook-form";
import CustomButton from "../components/CustomButton";

/* import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup"; */

const SignupScreen = () => {
  //const [name, setName] = useState("");
  //const [email, setEmail] = useState("");
  //const [phoneNumber, setPhoneNumber] = useState(null);

  const { authDispatch } = useContext(GlobalContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data) => {
    console.log("wdaasd");
    console.log(data);

    // llamar a la api aquí

    authDispatch({ type: actionTypes.SIGNUP });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regístrate en Aché</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            placeholderTextColor="rgba(0,0,0,0.3)"
            color="rgba(0,0,0,1)"
          />
        )}
        name="username"
        rules={{
          required: "Este campo es requerido",
          minLength: { value: 2, message: "el nombre no puede ser tan corto" },
          maxLength: { value: 15, message: "longitud excedida" },
        }}
        defaultValue=""
      />
      {errors.username && <Text>{errors.username.message}</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            placeholderTextColor="rgba(0,0,0,0.3)"
            color="rgba(0,0,0,1)"
          />
        )}
        name="_email"
        rules={{
          required: true,
          pattern: {
            value: /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/,
            message: "el correo no es válido",
          },
        }}
        defaultValue=""
      />
      {errors._email && <Text>{errors._email.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Número de Teléfono"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
            placeholderTextColor="rgba(0,0,0,0.3)"
            color="rgba(0,0,0,1)"
            keyboardType="phone-pad"
          />
        )}
        name="phone"
        rules={{
          required: true,
          //minLength: 11,
          //maxLength: 11,
          pattern: {
            value: /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/,
            message: "numero de teléfono no válido",
          },
        }}
      />
      {errors.phone && <Text>{errors.phone.message}</Text>}

      <View style={styles.submitButton}>
        <CustomButton title="Enviar" onPress={handleSubmit(onSubmit)} />
      </View>

      {/*  <View style={{ marginBottom: 10 }}>
        <Button title="Comenzar" onPress={() => handleSignup()} />
      </View> */}
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //  justifyContent: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 40,
    //flex: 0.5,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    width: "85%",
    //height: 50,
    // backgroundColor: "rgba(112, 28, 87, 0.1)",
    // borderRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(112, 28, 87, 1)",
    marginVertical: 15,
    paddingLeft: 10,
  },
  submitButton: {
    width: "90%",
    height: 50,
    marginTop: 20,
  },
});
