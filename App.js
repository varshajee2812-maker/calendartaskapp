// App.js
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Create the 'screens' directory and these files next
import CalendarScreen from './screens/CalendarScreen'; 
import NewTaskScreen from './screens/NewTaskScreen';
import TaskListScreen from './screens/TaskListScreen'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CalendarMonth">
        <Stack.Screen name="CalendarMonth" component={CalendarScreen} options={{ title: 'Calendar' }} />
        <Stack.Screen name="NewTask" component={NewTaskScreen} options={{ title: 'New Task' }} />
        <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Tasks' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}