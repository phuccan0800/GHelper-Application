import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CheckBox } from 'react-native-elements';

const CleanOption = ({ onOptionChange, defaultOption = {} }) => {
    const [numberOfWorkers, setNumberOfWorkers] = useState(defaultOption.workersNeeded[0]);
    const [cleaningType, setCleaningType] = useState(defaultOption.cleaningType[0].type);
    const [suppliesNeeded, setSuppliesNeeded] = useState(defaultOption.suppliesNeeded);
    const [numberOfRooms, setNumberOfRooms] = useState(defaultOption.roomsToClean[0]);

    const handleCleaningTypeChange = (value) => {
        setCleaningType(value);
        onOptionChange({ cleaningType: value });
    };
    useEffect(() => {
        onOptionChange({
            numberOfWorkers: numberOfWorkers,
            cleaningType: cleaningType,
            suppliesNeeded: suppliesNeeded,
            numberOfRooms: numberOfRooms
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { fontWeight: 'bold' }]}>Tùy chọn dọn dẹp</Text>

            <View style={styles.row}>
                <Text style={styles.normalText}>Số lượng người cần thuê:</Text>
                <View style={styles.checkboxContainer}>
                    {defaultOption.workersNeeded.map((num) => (
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
                <Text style={styles.normalText}>Loại dọn dẹp:</Text>
                <View style={styles.checkboxContainer}>
                    {defaultOption.cleaningType.map((type) => (
                        <TouchableOpacity key={type.type} onPress={() => {
                            handleCleaningTypeChange(type.type);
                        }}>
                            <CheckBox
                                title={type.type}
                                checked={cleaningType === type.type}
                                onPress={() => handleCleaningTypeChange(type.type)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.normalText}>Số phòng cần dọn:</Text>
                <View style={styles.checkboxContainer}>
                    {defaultOption.roomsToClean.map((room) => (
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
