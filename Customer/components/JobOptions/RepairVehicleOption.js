import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CheckBox } from 'react-native-elements';

const RepairVehicleOption = ({ onOptionChange, defaultOption = {} }) => {
    const [numberOfWorkers, setNumberOfWorkers] = useState(1);
    const [vehicleType, setVehicleType] = useState(defaultOption.vehicleType[0]);
    const [repairType, setRepairType] = useState(defaultOption.repairType[0]);
    const [numberOfRooms, setNumberOfRooms] = useState(1);

    const handleRepairVehicleType = (value) => {
        setVehicleType(value);
        onOptionChange({ vehicleType: value });
    };

    useEffect(() => {
        onOptionChange({
            numberOfWorkers: numberOfWorkers,
            vehicleType: vehicleType,
            repairType: repairType,
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { fontWeight: 'bold' }]}>Tùy chọn sửa xe</Text>

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
                <Text style={styles.normalText}>Loại Xe:</Text>
                <View style={styles.checkboxContainer}>
                    {defaultOption.vehicleType.map((type) => (
                        <TouchableOpacity key={type} onPress={() => {
                            handleRepairVehicleType(type);
                        }}>
                            <CheckBox
                                title={type.type}
                                checked={cleaningType === type.type}
                                onPress={() => handleCleaningTypeChange(type)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.normalText}>Bạn muốn sửa:</Text>
                <View style={styles.checkboxContainer}>
                    {defaultOption.repairType.map((type) => (
                        <TouchableOpacity key={type} onPress={() => {
                            setRepairType(type);
                        }}>
                            <CheckBox
                                title={`${room} phòng`}
                                checked={numberOfRooms === room}
                                onPress={() => {
                                    setRepairType(type);
                                    onOptionChange({ numberOfRooms: room });
                                }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
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

export default RepairVehicleOption;
