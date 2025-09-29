// screens/CalendarScreen.js

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const CalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // Function to load tasks and format them for the calendar
  const loadTasksAndMarkDates = async () => {
    try {
      // 1. Load all saved tasks
      const allTasksJson = await AsyncStorage.getItem('tasks');
      const allTasks = allTasksJson ? JSON.parse(allTasksJson) : [];

      // 2. Format tasks into the required markedDates object
      const marks = allTasks.reduce((acc, task) => {
        const dateKey = task.date;
        
        // Ensure the date entry exists or initialize it
        acc[dateKey] = acc[dateKey] || { dots: [] };
        
        // Add a dot to this date (for all tasks on that day)
        // Check if the dot is already added to prevent duplicates
        if (!acc[dateKey].dots.some(dot => dot.key === 'taskDot')) {
            acc[dateKey].dots.push({
                key: 'taskDot', 
                color: '#007AFF', 
                selectedDotColor: 'white'
            });
        }
        
        // If this date is the selected date, also mark it with a background color
        if (dateKey === selectedDate) {
            acc[dateKey].selected = true;
            acc[dateKey].selectedColor = '#007AFF';
        }
        
        return acc;
      }, {});

      setMarkedDates(marks);
    } catch (e) {
      console.error("Failed to load tasks for calendar:", e);
    }
  };
  
  // Reload marks whenever the screen becomes focused (after saving a new task)
  useFocusEffect(
    useCallback(() => {
      loadTasksAndMarkDates();
    }, [selectedDate]) // Re-run if selected date changes
  );


  const handleDayPress = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);

    // Navigate to the TaskList screen, passing the date
    navigation.navigate('TaskList', { selectedDate: dateString });
  };

  return (
    <View style={styles.container}>
      {/* 1. CALENDAR VIEW (The Month Display) */}
      <Calendar
        markingType={'dot'} // Enable dot marking
        markedDates={markedDates} // Pass the task data here
        onDayPress={handleDayPress}
        style={styles.calendar}
        theme={{
            todayTextColor: '#007AFF',
            selectedDayBackgroundColor: '#007AFF',
            selectedDayTextColor: '#ffffff',
            dotColor: '#007AFF',
            arrowColor: '#007AFF',
        }}
      />
      
      {/* Button to add a new task */}
      <Button 
        title="+ New Task" 
        onPress={() => navigation.navigate('NewTask')} 
        color="#33CC66"
      />

      <Text style={styles.infoText}>Tap a day on the calendar to view tasks, or tap '+ New Task' to schedule one.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    paddingHorizontal: 20,
  }
});

export default CalendarScreen;