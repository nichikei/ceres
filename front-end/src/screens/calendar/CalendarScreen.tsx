// src/screens/calendar/CalendarScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    StatusBar,
    Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors, spacing, borderRadius } from '../../context/ThemeContext';
import { eventStorage, type CalendarEvent, type EventCategory } from '../../services/eventStorage';

export default function CalendarScreen() {
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEventDetail, setShowEventDetail] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Form state
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventCategory, setNewEventCategory] = useState<EventCategory>('meal');
    const [newEventTime, setNewEventTime] = useState('');
    const [newEventNotes, setNewEventNotes] = useState('');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [tempTime, setTempTime] = useState(new Date());

    // Load events
    useFocusEffect(
        React.useCallback(() => {
            loadEvents();
        }, [])
    );

    const loadEvents = async () => {
        const storedEvents = await eventStorage.getEvents();
        setEvents(storedEvents);
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const getCategoryColor = (category: EventCategory) => {
        switch (category) {
            case 'meal':
                return '#FF6B6B';
            case 'workout':
                return colors.primary;
            case 'appointment':
                return '#4ECDC4';
            default:
                return colors.textSecondary;
        }
    };

    const getCategoryIcon = (category: EventCategory) => {
        switch (category) {
            case 'meal':
                return 'restaurant';
            case 'workout':
                return 'barbell';
            case 'appointment':
                return 'calendar';
            default:
                return 'ellipse';
        }
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => isSameDay(event.date, date));
    };

    const handlePreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const handleAddEvent = async () => {
        if (!newEventTitle.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề sự kiện');
            return;
        }

        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            title: newEventTitle,
            category: newEventCategory,
            date: new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                parseInt(newEventTime.split(':')[0] || '12'),
                parseInt(newEventTime.split(':')[1] || '0')
            ),
            time: newEventTime || '12:00',
            notes: newEventNotes,
        };

        await eventStorage.addEvent(newEvent);
        await loadEvents();
        setShowAddModal(false);

        // Reset form
        setNewEventTitle('');
        setNewEventCategory('meal');
        setNewEventTime('');
        setNewEventNotes('');

        Alert.alert('Thành công', 'Đã thêm sự kiện mới!');
    };

    const handleDeleteEvent = (eventId: string) => {
        Alert.alert(
            'Xóa sự kiện',
            'Bạn có chắc chắn muốn xóa sự kiện này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        await eventStorage.deleteEvent(eventId);
                        await loadEvents();
                        setShowEventDetail(false);
                        Alert.alert('Đã xóa', 'Sự kiện đã được xóa');
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ion icons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Lịch sức khỏe</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.monthTitle}>
                    {format(currentDate, 'MMMM yyyy', { locale: vi })}
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.primary,
        paddingTop: 50,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: spacing.sm,
        marginLeft: -8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        textTransform: 'capitalize',
        padding: spacing.md,
    },
});
