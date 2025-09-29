// screens/NewTaskScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert,
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'react-native-get-random-values'; 
import { v4 as uuidv4 } from 'uuid'; 

const NewTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [assignee, setAssignee] = useState('');
  const [date] = useState(new Date()); 
  
  const saveTask = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Task title is required.");
      return;
    }

    const newTask = {
      id: uuidv4(), 
      title: title.trim(),
      notes: notes.trim(),
      assignee: assignee.trim(),
      date: moment(date).format('YYYY-MM-DD'), 
      time: moment(date).format('HH:mm'), 
    };

    try {
      const existingTasksJson = await AsyncStorage.getItem('tasks');
      const existingTasks = existingTasksJson ? JSON.parse(existingTasksJson) : [];
      const updatedTasks = [...existingTasks, newTask];

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      Alert.alert("Success", "Task saved and scheduled!");
      navigation.goBack(); 
      
    } catch (e) {
      console.error("Failed to save task:", e);
      Alert.alert("Error", "Could not save task. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Task Title (Required):</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g., Final Presentation Prep"
        value={title} 
        onChangeText={setTitle} 
      />
      
      <Text style={styles.label}>Assignee:</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Who is responsible?"
        value={assignee} 
        onChangeText={setAssignee} 
      />

      <Text style={styles.label}>Scheduled Date:</Text>
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>
          {moment(date).format('MMMM Do YYYY')} (Defaulted to Today)
        </Text>
      </View>
      
      <Text style={styles.label}>Notes:</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Add details, location, or related links..."
        value={notes} 
        onChangeText={setNotes} 
        multiline
      />
      
      <Button 
        title="SAVE TASK" 
        onPress={saveTask} 
        color="#007AFF"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  dateBox: { padding: 12, backgroundColor: '#e6f0ff', borderRadius: 8, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#007AFF' },
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' }
});

export default NewTaskScreen;