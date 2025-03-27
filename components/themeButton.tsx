import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/themeContext';

export default function ThemeToggleButton() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity style={styles.button} onPress={toggleTheme}>
      <Text style={[styles.text, { color: darkMode ? '#fff' : '#000' }]}>
        Cambiar a {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
