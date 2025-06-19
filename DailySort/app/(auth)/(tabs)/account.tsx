import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Modal, TextInput, Switch } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useSupabase } from "@/context/SupabaseContext";

const Account = () => {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const { updateUserName } = useSupabase();
  const userId = user?.id;
  const [modalVisible, setModalVisible] = useState<null | "edit" | "notifications" | "privacy" | "help">(null);
  
  // Estado para el nombre que se muestra en la interfaz
  const [displayName, setDisplayName] = useState(user?.firstName || "");
  // Estado para el nombre que se está editando en el modal
  const [editingName, setEditingName] = useState(user?.firstName || "");

  // Notification settings
  const [pushNotifications, setPushNotifications] = useState(true);
  // Privacy settings
  const [privateAccount, setPrivateAccount] = useState(false);
  
  const [pendingSuccess, setPendingSuccess] = useState(false);
  const prevModalVisible = useRef<null | string>(null);

  // Actualizar el estado cuando el usuario de Clerk cambie
  useEffect(() => {
    if (user?.firstName) {
      setDisplayName(user.firstName);
      setEditingName(user.firstName);
    }
  }, [user?.firstName]);

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            console.log("Attempting to log out...");
            try {
              await signOut();
              console.log("User signed out successfully");
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Could not sign out. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!updateUserName) {
      Alert.alert("Error", "No se pudo actualizar el nombre (función no disponible).");
      return;
    }
    
    const trimmedName = editingName.trim();
    
    if (!userId || !trimmedName) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }

    try {
      // 1. Actualizar en Supabase
      await updateUserName(userId, trimmedName);
      
      // 2. Actualizar en Clerk usando la API correcta
      if (user && user.update) {
        try {
          await user.update({
            firstName: trimmedName
          });
          await user.reload();
        } catch (clerkError) {
          console.log("Clerk update error (non-critical):", clerkError);
          // Si falla Clerk, continuamos ya que Supabase se actualizó correctamente
        }
      }
      
      // 3. Actualizar el estado local inmediatamente
      setDisplayName(trimmedName);
      
      // 4. Cerrar modal y mostrar éxito
      setModalVisible(null);
      setPendingSuccess(true);
      
    } catch (error) {
      console.error("Error updating name:", error);
      Alert.alert("Error", "No se pudo actualizar el nombre. Intenta de nuevo.");
    }
  };

  // Función para abrir el modal de edición
  const openEditModal = () => {
    setEditingName(displayName); // Resetear el valor de edición al valor actual
    setModalVisible("edit");
  };

  const handleSaveNotifications = () => {
    // Here you would save notification preferences to your backend
    Alert.alert("Success", "Notification preferences saved!");
    setModalVisible(null);
  };

  const handleSavePrivacy = () => {
    // Here you would save privacy settings to your backend
    Alert.alert("Success", "Privacy settings updated!");
    setModalVisible(null);
  };

  // Detecta cuando el modal se ha cerrado y muestra la alerta
  useEffect(() => {
    if (prevModalVisible.current === "edit" && modalVisible === null && pendingSuccess) {
      setPendingSuccess(false);
      setTimeout(() => {
        Alert.alert("Éxito", "¡Nombre actualizado correctamente!");
      }, 100);
    }
    prevModalVisible.current = modalVisible;
  }, [modalVisible, pendingSuccess]);

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header with avatar and name */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#666" />
              </View>
            )}
          </View>
          <Text style={styles.userName}>
            {displayName || "User"}
          </Text>
          <Text style={styles.userEmail}>
            {user?.primaryEmailAddress?.emailAddress || "Email not available"}
          </Text>
        </View>

        {/* User Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>
                {displayName || ""}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {user?.primaryEmailAddress?.emailAddress || "Not available"}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={openEditModal}
          >
            <Ionicons name="person-outline" size={20} color="#007AFF" style={styles.icon} />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalVisible("notifications")}
          >
            <Ionicons name="notifications-outline" size={20} color="#007AFF" style={styles.icon} />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalVisible("privacy")}
          >
            <Ionicons name="shield-outline" size={20} color="#007AFF" style={styles.icon} />
            <Text style={styles.menuText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setModalVisible("help")}
          >
            <Ionicons name="help-circle-outline" size={20} color="#007AFF" style={styles.icon} />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <Modal
          visible={modalVisible === "edit"}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    value={editingName}
                    onChangeText={setEditingName}
                    placeholder="Enter your full name"
                    style={styles.input}
                  />
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => {
                      setEditingName(displayName); // Resetear cambios
                      setModalVisible(null);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Notifications Modal */}
        <Modal
          visible={modalVisible === "notifications"}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalTitle}>Notification Settings</Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Push Notifications</Text>
                    <Text style={styles.settingDescription}>Receive notifications on your device</Text>
                  </View>
                  <Switch
                    value={pushNotifications}
                    onValueChange={setPushNotifications}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveNotifications}>
                    <Text style={styles.saveButtonText}>Save Settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(null)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Privacy & Security Modal */}
        <Modal
          visible={modalVisible === "privacy"}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalTitle}>Privacy & Security</Text>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>Private Account</Text>
                    <Text style={styles.settingDescription}>Only approved followers can see your posts</Text>
                  </View>
                  <Switch
                    value={privateAccount}
                    onValueChange={setPrivateAccount}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSavePrivacy}>
                    <Text style={styles.saveButtonText}>Save Settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(null)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Help & Support Modal */}
        <Modal
          visible={modalVisible === "help"}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalTitle}>Help & Support</Text>
                
                <View style={styles.helpSection}>
                  <Text style={styles.helpSectionTitle}>Contact Us</Text>
                  
                  <TouchableOpacity
                    style={styles.helpItem}
                    onPress={() => {
                      import("react-native").then(({ Linking }) => {
                        Linking.openURL("https://github.com/lDavidSantiago/MovileDevFinalProyect/tree/main");
                      });
                    }}
                  >
                    <Ionicons name="logo-github" size={20} color="#007AFF" style={styles.icon} />
                    <Text style={styles.helpItemText}>GitHub Repository</Text>
                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                  </TouchableOpacity>
                </View>

                <View style={styles.appInfo}>
                  <Text style={styles.appInfoText}>App Version: 1.0.0</Text>
                  <Text style={styles.appInfoText}>Build: 2024.01.01</Text>
                </View>

                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(null)}>
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Logout button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" style={styles.icon} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

// Los estilos permanecen igual
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  icon: {
    marginRight: 15,
    width: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#FFF2F2',
    borderRadius: 10,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
  },
  modalScrollView: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  modalButtons: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFF2F2',
    borderRadius: 8,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  helpSection: {
    marginBottom: 24,
  },
  helpSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  helpItemText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  appInfo: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    marginTop: 16,
  },
  appInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default Account;