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

    // Load events from storage on mount and when screen focuses
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

    const renderCalendarGrid = () => {
        const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

        // Calculate first day offset
        const firstDayOfMonth = monthStart.getDay();
        const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        // Add empty cells for offset
        const gridCells = Array(offset).fill(null);

        return (
            <View style={styles.calendarGrid}>
                {/* Week day headers */}
                <View style={styles.weekDaysRow}>
                    {weekDays.map((day, index) => (
                        <View key={index} style={styles.weekDayCell}>
                            <Text style={styles.weekDayText}>{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Calendar days */}
                <View style={styles.daysGrid}>
                    {gridCells.map((_, index) => (
                        <View key={`empty-${index}`} style={styles.dayCell} />
                    ))}

                    {calendarDays.map((day, index) => {
                        const dayEvents = getEventsForDate(day);
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentDay = isToday(day);
                        const isCurrentMonth = isSameMonth(day, currentDate);

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayCell,
                                    isSelected && styles.dayCellSelected,
                                    isCurrentDay && !isSelected && styles.dayCellToday,
                                ]}
                                onPress={() => setSelectedDate(day)}
                            >
                                <Text
                                    style={[
                                        styles.dayText,
                                        !isCurrentMonth && styles.dayTextOtherMonth,
                                        isSelected && styles.dayTextSelected,
                                        isCurrentDay && !isSelected && styles.dayTextToday,
                                    ]}
                                >
                                    {format(day, 'd')}
                                </Text>

                                {dayEvents.length > 0 && (
                                    <View style={styles.eventDots}>
                                        {dayEvents.slice(0, 3).map((event, i) => (
                                            <View
                                                key={i}
                                                style={[
                                                    styles.eventDot,
                                                    { backgroundColor: getCategoryColor(event.category) },
                                                ]}
                                            />
                                        ))}
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>📅 Lịch sức khỏe</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Month Navigation */}
            <View style={styles.monthNav}>
                <TouchableOpacity onPress={handlePreviousMonth} style={styles.monthButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                    {format(currentDate, 'MMMM yyyy', { locale: vi })}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton}>
                    <Ionicons name="chevron-forward" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Calendar Grid */}
                {renderCalendarGrid()}
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
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    monthButton: {
        padding: spacing.xs,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        textTransform: 'capitalize',
    },
    // Calendar Grid
    calendarGrid: {
        backgroundColor: colors.surface,
        marginTop: spacing.sm,
        paddingBottom: spacing.md,
    },
    weekDaysRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.sm,
        paddingTop: spacing.sm,
    },
    weekDayCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    weekDayText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.sm,
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xs,
    },
    dayCellSelected: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
    },
    dayCellToday: {
        backgroundColor: colors.primary + '20',
        borderRadius: borderRadius.md,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
    dayTextOtherMonth: {
        color: colors.textSecondary,
        opacity: 0.4,
    },
    dayTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    dayTextToday: {
        color: colors.primary,
        fontWeight: '700',
    },
    eventDots: {
        flexDirection: 'row',
        gap: 2,
        marginTop: 2,
    },
    eventDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
});
