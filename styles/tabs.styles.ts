import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1, //  Hace que el contenedor ocupe toda la pantalla
      justifyContent: "center", //  Centra el contenido verticalmente
      alignItems: "center", //  Centra el contenido horizontalmente
      backgroundColor: "#252424" //  Color de fondo semitransparente
    },
  
    buttonText: {
      fontSize: 18, //  Tamaño del texto del botón
      color: "rgba(1, 111, 255, 0.5)", //  Azul con transparencia
      padding: 10, //  Espaciado interno
    },
  
    modalContainer: {
      flex: 1, //  El modal ocupa toda la pantalla
      justifyContent: "center", //  Centra el modal en la pantalla verticalmente
      alignItems: "center", //  Centra el modal en la pantalla horizontalmente
    },
  
    modalContent: {
      backgroundColor: "white", //  Fondo blanco para el modal
      padding: 20, //  Espaciado interno para que los elementos no queden pegados
      borderRadius: 4, //  Bordes redondeados
      alignItems: "center", //  Centra los elementos dentro del modal
      width: "80%", //  Ancho del modal en el 80% de la pantalla
      borderColor: "rgba(17, 17, 17, 0.1)", //  Color del borde del modal con opacidad
    },
  
    modalTitle: {
      fontSize: 20, //  Tamaño de fuente más grande
      fontWeight: "bold", //  Texto en negrita
      marginBottom: 20, //  Espaciado hacia abajo
    },
  
    optionText: {
      fontSize: 16, //  Tamaño del texto de las opciones
      color: "rgb(2, 2, 2)", //  Texto negro
      marginTop: 10, //  Espaciado entre las opciones
    },
  
    closeText: {
      fontSize: 16, //  Tamaño del botón de cierre
      color: "rgba(245, 5, 5, 0.99)", //  Rojo intenso con opacidad
      marginTop: 10, //  Espaciado hacia arriba para separarlo de las opciones
    },

    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 10,
    },
    userName: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 10,
    },
    darkMode: {
      backgroundColor: "#000",
      color: "#fff",
    },
    lightMode: {
      backgroundColor: "#fff",
      color: "#000",
    },
  });