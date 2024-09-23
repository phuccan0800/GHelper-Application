import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { CheckBox } from 'react-native-elements';

const CleanOption = ({ onOptionChange }) => {
    const [timeWork, setTimeWork] = useState(null);
    const [numberOfWorkers, setNumberOfWorkers] = useState(1);
    const [cleaningType, setCleaningType] = useState(null);
    const [suppliesNeeded, setSuppliesNeeded] = useState(false);
    const [numberOfRooms, setNumberOfRooms] = useState(1);

    const handleTimeWorkChange = (value) => {
        setTimeWork(value);
        onOptionChange({ timeWork: value });
    };

    const handleCleaningTypeChange = (value) => {
        setCleaningType(value);
        onOptionChange({ cleaningType: value });
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { fontWeight: 'bold' }]}>Tùy chọn dọn dẹp</Text>

            <View style={styles.row}>
                <Text style={styles.normalText}>Số lượng người cần thuê:</Text>
                <View style={styles.checkboxContainer}>
                    {[1, 2, 3].map((num) => (
                        <TouchableOpacity key={num} onPress={() => {
                            setNumberOfWorkers(num);
                            onOptionChange({ numberOfWorkers: num });
                        }}>
                            <CheckBox
                                title={`${num} người`}
                                checked={numberOfWorkers === num}
                                onPress={() => {
                                    setNumberOfWorkers(num);
                                    onOptionChange({ numberOfWorkers: num });
                                }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.normalText}>Thời gian thuê:</Text>
                <View style={styles.checkboxContainer}>
                    {[1, 2, 3].map((hour) => (
                        <TouchableOpacity key={hour} onPress={() => {
                            handleTimeWorkChange(hour);
                        }}>
                            <CheckBox
                                title={`${hour} giờ`}
                                checked={timeWork === hour}
                                onPress={() => handleTimeWorkChange(hour)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.normalText}>Loại dọn dẹp:</Text>
                <View style={styles.checkboxContainer}>
                    {['Toàn bộ', 'Phòng khách', 'Phòng bếp', 'Vệ sinh'].map((type) => (
                        <TouchableOpacity key={type} onPress={() => {
                            handleCleaningTypeChange(type);
                        }}>
                            <CheckBox
                                title={type}
                                checked={cleaningType === type}
                                onPress={() => handleCleaningTypeChange(type)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.normalText}>Số phòng cần dọn:</Text>
                <View style={styles.checkboxContainer}>
                    {[1, 2, 3, 4, 5].map((room) => (
                        <TouchableOpacity key={room} onPress={() => {
                            setNumberOfRooms(room);
                            onOptionChange({ numberOfRooms: room });
                        }}>
                            <CheckBox
                                title={`${room} phòng`}
                                checked={numberOfRooms === room}
                                onPress={() => {
                                    setNumberOfRooms(room);
                                    onOptionChange({ numberOfRooms: room });
                                }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.row}>
                <CheckBox
                    title="Cung cấp dụng cụ dọn dẹp"
                    checked={suppliesNeeded}
                    onPress={() => {
                        setSuppliesNeeded(!suppliesNeeded);
                        onOptionChange({ suppliesNeeded: !suppliesNeeded });
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    row: {
        marginBottom: 15,
    },
    normalText: {
        fontSize: 16,
        marginRight: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default CleanOption;
