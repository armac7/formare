import React, { useState, useMemo, use } from "react";
import { fromat, startOfMonth, endOfMonth, startOfWeek, endOfweek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

/**
 * FORMARE: All-in-One Cycle Tracker
 * Features: Fahrenheit BBT, Icon-based symptoms, Integrated Calender
 */

const FormareApp = () = () => {
    // STATE
    const [selecedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [logs, setLogs] = useState({}); // store date keyed by "YYYY-MM-DD"

    const dateKey = format(setSelectedDate, 'yyyy-MM-dd');
    const activeLog = logs[dateKey] || {};

    //LOGIC Update symptoms
    const updateLog = (field, value) => {
        setLogs(prev => ({
            ...prev,
            [dateKey]: { ...activeLog, [field]: value }
        }));
    };
    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    // styles/UI

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <header style={styles.header}>
                <h1 style={{ margin: 0, color: '#ff4d6d' }}>Formare</h1>
                <div style={styles.avatar}>👤</div>
            </header>

            <div style={styles.mainLayout}>

                {/* CALENDAR SECTION */}
                <section style={styles.card}>
                    <div style={styles.calendarHeader}>
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&lt;</button>
                        <h2 style={{ fontSize: '1.2rem' }}>{format(currentMonth, 'MMMM yyyy')}</h2>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&gt;</button>
                    </div>

                    <div style={styles.calendarGrid}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} style={styles.dayLabel}>{d}</div>
                        ))}
                        {days.map(day => {
                            const dKey = format(day, 'yyyy-MM-dd');
                            const hasData = logs[dKey];
                            return (
                                <div
                                    key={dKey}
                                    onClick={() => setSelectedDate(day)}
                                    style={{
                                        ...styles.dayCell,
                                        backgroundColor: isSameDay(day, selectedDate) ? '#ff4d6d' : 'transparent',
                                        color: isSameDay(day, selectedDate) ? 'white' : isSameMonth(day, currentMonth) ? '#333' : '#ccc',
                                        border: isSameDay(day, new Date()) ? '1px solid #ff4d6d' : 'none'
                                    }}
                                >
                                    {format(day, 'd')}
                                    {hasData && <div style={{ ...styles.dot, backgroundColor: hasData.bleeding !== 'none' ? '#ff4d6d' : '#4dabf7' }} />}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* INPUT SECTION */}
                <section style={styles.card}>
                    <h2 style={{ marginTop: 0 }}>Logging for {format(selectedDate, 'MMM do')}</h2>

                    {/* TEMPERATURE (°F) */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Basal Body Temp (°F)</label>
                        <div style={styles.tempControls}>
                            <button style={styles.stepperBtn} onClick={() => updateLog('temp', (parseFloat(activeLog.temp) - 0.1).toFixed(1))}>−</button>
                            <div style={styles.tempDisplay}>{activeLog.temp}°F</div>
                            <button style={styles.stepperBtn} onClick={() => updateLog('temp', (parseFloat(activeLog.temp) + 0.1).toFixed(1))}>+</button>
                        </div>
                    </div>

                    {/* BLEEDING ICONS */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Menstrual Flow</label>
                        <div style={styles.iconRow}>
                            {[
                                { id: 'none', icon: '🚫', label: 'None' },
                                { id: 'light', icon: '💧', label: 'Light' },
                                { id: 'medium', icon: '🩸', label: 'Med' },
                                { id: 'heavy', icon: '♨️', label: 'Heavy' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => updateLog('bleeding', item.id)}
                                    style={{ ...styles.iconBtn, border: activeLog.bleeding === item.id ? '2px solid #ff4d6d' : '2px solid transparent' }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                    <span style={{ fontSize: '0.7rem' }}>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CERVICAL MUCUS ICONS */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Cervical Mucus</label>
                        <div style={styles.iconRow}>
                            {[
                                { id: 'dry', icon: '☁️', label: 'Dry' },
                                { id: 'sticky', icon: '🥛', label: 'Sticky' },
                                { id: 'watery', icon: '🌊', label: 'Watery' },
                                { id: 'eggwhite', icon: '✨', label: 'Egg White' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => updateLog('mucus', item.id)}
                                    style={{ ...styles.iconBtn, border: activeLog.mucus === item.id ? '2px solid #4dabf7' : '2px solid transparent' }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                    <span style={{ fontSize: '0.7rem' }}>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

// --- STYLES (Basic CSS-in-JS for single file) ---
const styles = {
    container: { fontFamily: 'sans-serif', backgroundColor: '#fff5f6', minHeight: '100vh', paddingBottom: '40px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    mainLayout: { display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', maxWidth: '900px', margin: '0 auto' },
    card: { backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
    calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center' },
    dayLabel: { fontWeight: 'bold', fontSize: '0.8rem', color: '#888', paddingBottom: '10px' },
    dayCell: { padding: '10px 0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    dot: { width: '5px', height: '5px', borderRadius: '50%', marginTop: '2px' },
    inputGroup: { marginBottom: '25px' },
    label: { display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' },
    tempControls: { display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', background: '#f8f9fa', padding: '15px', borderRadius: '12px' },
    tempDisplay: { fontSize: '1.5rem', fontWeight: 'bold' },
    stepperBtn: { width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: '#ff4d6d', color: 'white', fontSize: '1.2rem', cursor: 'pointer' },
    iconRow: { display: 'flex', justifyContent: 'space-between', gap: '10px' },
    iconBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', padding: '10px', borderRadius: '12px', background: '#f8f9fa', cursor: 'pointer' }
};

export default FormareApp;

