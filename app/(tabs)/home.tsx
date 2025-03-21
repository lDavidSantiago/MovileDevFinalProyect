import { Modal, Text, View, TouchableOpacity} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/tabs.styles";
import { useState } from "react";

export default function Index() {
  // Estado para controlar si el modal está visible o no
  const [modalVisible, setModalVisible] = useState(false);

  const [elements, setElements] = useState<{id:number, type:string}[]>([]);

  const addNewElement = (type:string) => {
    setElements([...elements,  {id: elements.length + 1, type}]);
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>
          ➕New Element</Text>
        </TouchableOpacity>

        {/*  creacion botones  */}
        {elements.map((element) => (
          <TouchableOpacity key={element.id}>
            <Text style={styles.buttonText}>{element.type}</Text>

            </TouchableOpacity>

        ))}

        {/*  MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}    
          onRequestClose={() => setModalVisible(false)}
        >
          <View style ={styles.modalContainer}>
            <View style ={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Nuevo Elemento</Text>

              <TouchableOpacity onPress={() => {
                addNewElement("To-Do List " );
                setModalVisible(false)}}>
                <Text style={styles.optionText}>
                📋 To-Do List 
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                addNewElement("Calendar");
                setModalVisible(false)}}>
                <Text style={styles.optionText}>
                📆 Calendar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                addNewElement("Notes");
                setModalVisible(false)}}>
                <Text style={styles.optionText}>
                📝 Notes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>
                ❌ Close
                </Text>
              </TouchableOpacity>

              </View>
            </View>
        </Modal>

    </View>
  );
}
