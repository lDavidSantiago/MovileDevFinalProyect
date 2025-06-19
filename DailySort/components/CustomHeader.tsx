import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({ onSearchUser, setSearch }) => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    setSearch(searchText);
    onSearchUser();
    navigation.goBack(); // Or any other navigation action
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Invite by name, username or email"
        autoCapitalize="none"
        autoFocus={true}
        onChangeText={(text) => setSearchText(text)}
      />
      <Button title="Done" onPress={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
});

export default CustomHeader;