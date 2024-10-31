import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import ChooseLocation from '../components/ChooseLocation';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CleanOption from '../components/JobOptions/CleanOption';
import RepairVehicleOption from '../components/JobOptions/RepairVehicleOption';
import ApiCall from '../api/ApiCall';
import { useToast } from '../context/ToastContext';

const RentJob = ({ navigation, route }) => {
    const { showToast } = useToast();
    const [location, setLocation] = useState(route.params.location);
    const [options, setOptions] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    const handleLocationSelect = (loc) => {
        setLocation(loc);
    };

    const handleOptionChange = (newOptions) => {
        setOptions(prevOptions => ({ ...prevOptions, ...newOptions }));
        setTotalPrice(newOptions.price);
    };

    const handleContinue = async () => {
        response = await ApiCall.checkJobPrice(route.params.job.id, options);
        if (response.status === 200) {
            navigation.navigate('RentJobConfirm', { job: route.params.job, location, options, totalPrice });
        } else {
            showToast(response.message, 'error');
            console.log(route.params.job.id, "Options sent:", options);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>{route.params.job.title}</Text>
            </View>
            <ScrollView>
                {!location ? (
                    <ChooseLocation onLocationSelect={handleLocationSelect} navigation={navigation} />
                ) : (
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.normalText}>Vị trí bạn đã chọn:</Text>
                            <TouchableOpacity onPress={() => setLocation(null)}>
                                <Text>
                                    <FontAwesome5 name="map-marked-alt" size={18} color="black" />
                                    {` ${location.lat}, ${location.long}`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {route.params.job.title === 'Dọn dẹp' ? (
                            <CleanOption onOptionChange={handleOptionChange} defaultOption={route.params.job.options} />
                        ) : route.params.job.title === 'Sửa xe' ? (
                            <RepairVehicleOption onOptionChange={handleOptionChange} defaultOption={route.params.job.options} />
                        ) : (
                            <Text>Thông tin mặc định</Text>
                        )}
                    </View>
                )}
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Tiếp tục - {totalPrice.toLocaleString()} VNĐ</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },

    row: {
        marginVertical: 10,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 15,
        marginVertical: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RentJob;
