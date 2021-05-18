import * as React from "react";
import {
	Button,
	StyleSheet,
	Text,
	View,
	Dimensions,
	ImageBackground,
	Image,
	TouchableWithoutFeedback,
	Animated,
	Easing,
} from "react-native";
import CustomButtom from "../../components/CustomButton";
import CobrarPremioModal from "./components/CobrarPremioModal";

const { width, height } = Dimensions.get("screen");

const GameScreen = ({ navigation }) => {
	const [modalVisible, setModalVisible] = React.useState(false);
	const [stopAnimation, setStopAnumation] = React.useState(false);

	const wheelValue = new Animated.Value(0);
	const centerValue = new Animated.Value(0);

	const customStyleRedButton = {
		width: width / 3.5,
		height: width / 3.5,
		borderRadius: width / 7,
		paddingVertical: 0,
		paddingHorizontal: 0,
		//backgroundColor: "#8e0000",
		//backgroundColor: "rgba(247, 117, 30,1)",
		backgroundColor: "rgba(247, 115, 27,0.8)",
		marginBottom: "50%",
	};

	const customStyleBlackButton = {
		width: width / 3.5,
		height: width / 3.5,
		borderRadius: width / 7,
		paddingVertical: 0,
		paddingHorizontal: 0,
		//backgroundColor: "black",
		marginTop: "50%",
	};

	const onPressWheel = () => {
		wheelValue.setValue(0);
		//centerValue.setValue(0);

		Animated.timing(wheelValue, {
			toValue: 1,
			duration: 8000,
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: true,
		}).start();
	};

	const wheel = wheelValue.interpolate({
		// Next, interpolate beginning and end values (in this case 0 and 1)

		inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
		outputRange: [
			"0deg",
			"360deg",
			"720deg",
			"1080deg",
			"1440deg",
			"1700deg", //1800 complete
		],
	});

	/*const center = centerValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "0deg"],
	});*/

	return (
		<>
			{modalVisible ? (
				<View style={styles.containerCobrar}>
					<CobrarPremioModal
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						navigation={navigation}
					/>
				</View>
			) : (
				<ImageBackground
					source={require("../../assets/images/home/fondoOscuro.png")}
					style={{
						width: "100%",
						height: "100%",
						flex: 1,
					}}
				>
					<View style={styles.containerGame}>
						<View style={styles.buttonContainer} key={1}>
							<CustomButtom
								customStyle={customStyleRedButton}
								onPress={() => setModalVisible(true)}
							/>
						</View>
						<View
							key={2}
							style={{
								position: "absolute",
								left: -height / 3,
								top: height / 6,
							}}
						>
							<ImageBackground
								source={require("../../assets/images/home/fondo.png")}
								style={{
									width: height / 1.5,
									height: height / 1.5,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<View
									style={{
										position: "absolute",
										right: 0,
										elevation: 2,
									}}
								>
									<Image
										source={require("../../assets/images/home/selecor.png")}
										style={{ height: 105, width: 85 }}
									/>
								</View>

								<ImageBackground
									source={require("../../assets/images/home/bisel.png")}
									style={{
										width: height / 2 + 10,
										height: height / 2 + 10,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<TouchableWithoutFeedback
										onPress={() => onPressWheel()}
									>
										<Animated.View
											style={{
												transform: [{ rotate: wheel }],
											}}
										>
											<ImageBackground
												source={require("../../assets/images/home/casillas.png")}
												style={{
													width: height / 2,
													height: height / 2,
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<View
													style={{
														elevation: 5,
														//position: "absolute",
													}}
												>
													<Image
														source={require("../../assets/images/home/centro.png")}
														style={{
															width: width / 5,
															height: width / 5,
														}}
													/>
												</View>
											</ImageBackground>
										</Animated.View>
										{/*	<Image
												source={require("../../assets/images/home/centro.png")}
												style={{
													width: width / 5,
													height: width / 5,
													position: "absolute",
												}}
											/>*/}
									</TouchableWithoutFeedback>
								</ImageBackground>
							</ImageBackground>
						</View>
						<View key={3} style={styles.buttonContainer}>
							<CustomButtom
								customStyle={customStyleBlackButton}
								onPress={() => {
									navigation.jumpTo("Nueva Recarga", {
										screen: "Nueva Recarga",
									});
								}}
							/>
						</View>
					</View>
				</ImageBackground>
			)}
		</>
	);
};

export default GameScreen;

const styles = StyleSheet.create({
	containerGame: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-around",
	},
	containerCobrar: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		width: "80%",
	},
});
