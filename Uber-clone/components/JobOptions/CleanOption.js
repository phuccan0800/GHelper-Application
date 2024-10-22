import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CheckBox } from 'react-native-elements';

const CleanOption = ({ onOptionChange, defaultOption = {} }) => {
    const [numberOfWorkers, setNumberOfWorkers] = useState(defaultOption.workersNeeded[0]);
    const [cleaningType, setCleaningType] = useState(defaultOption.cleaningType[0].type);
    const [suppliesNeeded, setSuppliesNeeded] = useState(defaultOption.suppliesNeeded.required);
    const [numberOfRooms, setNumberOfRooms] = useState(defaultOption.roomsToClean[0].roomCount);
    const [price, setPrice] = useState(0);

    // Effect to update price when options change
    useEffect(() => {
        const updatePrice = async () => {
            const cleaningTypeInfo = defaultOption.cleaningType.find(ct => ct.type === cleaningType);
            const roomInfo = defaultOption.roomsToClean.find(room => room.roomCount === numberOfRooms);
            const suppliesAdjustment = suppliesNeeded ? defaultOption.suppliesNeeded.priceAdjustment : 0;
            const workerPriceInfo = defaultOption.workerPrices.find(worker => worker.workerCount === numberOfWorkers);
            const workerPrice = workerPriceInfo ? workerPriceInfo.price : 0;

            const totalPrice = (cleaningTypeInfo.priceDefault || 0) + (roomInfo.priceAdjustment || 0) + suppliesAdjustment + workerPrice;
            setPrice(totalPrice);

            // Call onOptionChange only after the price is updated
            onOptionChange({
                numberOfWorkers,
                cleaningType,
                suppliesNeeded,
                numberOfRooms,
                price: totalPrice, // Use the newly calculated total price
            });
        };

        updatePrice();
    }, [numberOfWorkers, cleaningType, suppliesNeeded, numberOfRooms]); // Dependency array

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tùy chọn dọn dẹp</Text>

            <OptionSelector
                title="Số lượng người cần thuê:"
                options={defaultOption.workersNeeded}
                selectedOption={numberOfWorkers}
                onSelect={setNumberOfWorkers}
            />

            <OptionSelector
                title="Loại dọn dẹp:"
                options={defaultOption.cleaningType.map(type => type.type)}
                selectedOption={cleaningType}
                onSelect={setCleaningType}
            />

            <OptionSelector
                title="Số phòng cần dọn:"
                options={defaultOption.roomsToClean.map(room => room.roomCount)}
                selectedOption={numberOfRooms}
                onSelect={setNumberOfRooms}
            />

            <CheckBox
                title="Cung cấp dụng cụ dọn dẹp"
                checked={suppliesNeeded}
                onPress={() => setSuppliesNeeded(!suppliesNeeded)}
            />
        </View>
    );
};

const OptionSelector = ({ title, options, selectedOption, onSelect }) => (
    <View style={styles.row}>
        <Text style={styles.normalText}>{title}</Text>
        <View style={styles.checkboxContainer}>
            {options.map((option) => (
                <TouchableOpacity key={option} onPress={() => onSelect(option)}>
                    <CheckBox
                        title={`${option}`}
                        checked={selectedOption === option}
                        onPress={() => onSelect(option)}
                    />
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

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
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default CleanOption;
