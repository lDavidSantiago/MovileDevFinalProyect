import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {styles} from '@/styles/tabs.calendar';




export default function CalendarOption(){

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const dayPress = (day:any) => {
        setSelectedDate(day.dateString);
    };

    return(
    <View style={styles.container}>
        <Calendar
            onDayPress={dayPress}
            markedDates={{
                [selectedDate]: 
                {   selected: true, 
                    marked: true, 
                    selectedColor: 'blue',
                },
            }}
        />
    </View>
    );
}


