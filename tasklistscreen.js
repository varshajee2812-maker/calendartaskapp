// screens/TaskListScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

const TaskListScreen = ({ route, navigation }) => {
  const { selectedDate } = route.params; 
  
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const allTasksJson = await AsyncStorage.getItem('tasks');
      const allTasks = allTasksJson ? JSON.parse(allTasksJson) : [];

      const filteredTasks = allTasks.filter(task => task.date === selectedDate);
      
      setTasks(filteredTasks);
    } catch (e) {
      console.error("Failed to load tasks:", e);
      Alert.alert("Error", "Could not load tasks for this date.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskTime}>
          {item.time ? moment(item.time, 'HH:mm').format('h:mm A') : 'All Day'}
        </Text>
      </View>
      {item.notes ? <Text style={styles.taskNotes}>{item.notes}</Text> : null}
      {item.assignee ? <Text style={styles.taskAssignee}>Assigned to: {item.assignee}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Tasks for {moment(selectedDate).format('dddd, MMMM Do')}
      </Text>

      {isLoading ? (
        <Text style={styles.loadingText}>Loading tasks...</Text>
      ) : tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks scheduled for this day.</Text>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('NewTask')}
            >
                <Text style={styles.addButtonText}>+ Add New Task</Text>
            </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 15 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  taskItem: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#007AFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1.5, elevation: 2 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  taskTitle: { fontSize: 18, fontWeight: '600', color: '#007AFF', flex: 1 },
  taskTime: { fontSize: 14, color: '#666', fontWeight: '500', marginLeft: 10 },
  taskNotes: { fontSize: 14, color: '#333', marginTop: 5 },
  taskAssignee: { fontSize: 12, color: '#999', marginTop: 3, fontStyle: 'italic' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, color: '#888', marginBottom: 20, textAlign: 'center' },
  loadingText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: '#666' },
  addButton: { backgroundColor: '#33CC66', padding: 12, borderRadius: 25, marginTop: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default TaskListScreen;