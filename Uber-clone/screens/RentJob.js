import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import ChooseLocation from '../components/ChooseLocation';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CleanOption from '../components/JobOptions/CleanOption';

const RentJob = ({ navigation, route }) => {
    const [location, setLocation] = useState(route.params.location);
    const [options, setOptions] = useState({});

    const handleLocationSelect = (loc) => {
        setLocation(loc);
        console.log("Location selected:", loc);
    };

    const handleOptionChange = (newOptions) => {
        setOptions(prevOptions => ({ ...prevOptions, ...newOptions }));
    };

    const handleContinue = () => {
        // Gửi options tới trang tiếp theo
        console.log("Options sent:", options);
    };

    useEffect(() => {
        console.log(route.params);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.topBar, styles.area, { paddingBottom: 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>{route.params.job.title}</Text>
                <View></View>
            </View>
            <ScrollView>
                {!location && (
                    <Text style={[styles.normalText, styles.area]}>Vui lòng chọn vị trí bạn muốn thuê</Text>
                )}
                {location ? (
                    <View>
                        <View style={styles.row}>
                            <Text style={[styles.normalText, { fontWeight: 'bold' }]}>Vị trí bạn đã chọn:</Text>
                            <TouchableOpacity onPress={() => setLocation(null)}>
                                <Text>
                                    <FontAwesome5 name="map-marked-alt" size={18} color="black" />
                                    {` ${location.lat}, ${location.long}`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {(() => {
                            switch (route.params.job.id) {
                                case '66da79a7da7937da023efab1':
                                    return (
                                        <CleanOption onOptionChange={handleOptionChange} />
                                    );
                                // Thêm các trường hợp khác nếu cần
                                default:
                                    return <Text>Thông tin mặc định</Text>;
                            }
                        })()}


                    </View>
                ) : (
                    <ChooseLocation onLocationSelect={handleLocationSelect} navigation={navigation} />
                )}
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
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
    area: {
        marginHorizontal: 15,
    },
    normalText: {
        color: 'black',
        fontSize: 18,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
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
