import Toast from "react-native-root-toast"

export default showToast = (message) => {
    Toast.show(message, {
        duration: 3000,
        position: Toast.positions.BOTTOM,
        backgroundColor: '#2c2c2c',
        containerStyle: {
            borderRadius: 15,
        },
        textStyle: {
            textAlign: 'center'
        }
    });
}