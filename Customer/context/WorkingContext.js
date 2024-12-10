import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiCall from '../api/ApiCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookingApiCall from '../api/BookingApi';
import { useToast } from './ToastContext';

const WorkingContext = createContext();

export const WorkingProvider = ({ children }) => {
    const [workerState, setWorkerState] = useState({
        isSearching: false,
        worker: null,
        bookingId: null,
        location: null,
    });
    const showToast = useToast();
    const startSearching = (bookingId) => {
        setWorkerState({ isSearching: true, worker: null, bookingId });
        AsyncStorage.setItem('bookingId', bookingId);

    };

    const stopSearching = (worker = null) => {
        setWorkerState((prevState) => ({
            ...prevState,
            isSearching: false,
            worker,
        }));
    };

    useEffect(() => {
        const loadBookingId = async () => {
            const bookingId = await AsyncStorage.getItem('bookingId');
            if (bookingId) {
                console.log('Loaded booking ID:', bookingId);
                const location = await getBookingById(bookingId);
                setWorkerState((prevState) => ({
                    ...prevState,
                    isSearching: true,
                    bookingId: bookingId,
                    location: location,
                }));
            }
        };
        const getBookingById = async (bookingId) => {
            try {
                const response = await BookingApiCall.getBookingDetail(bookingId);
                if (response.status === 200) {
                    console.log('Got booking:', response.data.booking.location);
                    return response.data.booking.location;
                }
            } catch (error) {
                console.log('Error getting booking:', error);
            }
        }

        loadBookingId();
    }, []);

    useEffect(() => {
        const searchWorker = async () => {
            if (!workerState.isSearching) return;


            while (workerState.isSearching) {
                try {
                    const response = await ApiCall.findAndAssignWorker({
                        bookingId: workerState.bookingId
                    });
                    if (response.status === 200 && response.worker) {
                        stopSearching(response.worker);
                        console.log('Found worker:', response.worker);
                        break;
                    }
                    if (response.status === 404) {
                        stopSearching();
                        console.log('Stopped searching.');
                        showToast({ type: 'error', message: response.message });
                        AsyncStorage.removeItem('bookingId');
                        break;
                    }
                } catch (error) {
                    console.log('Error during worker search:', error);
                }

                // Chờ 5 giây trước khi thử lại
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }

        };

        searchWorker();
    }, [workerState.isSearching, workerState.bookingId, workerState.location]);

    return (
        <WorkingContext.Provider value={{ workerState, startSearching, stopSearching }}>
            {children}
        </WorkingContext.Provider>
    );
};

export const useWorkingContext = () => useContext(WorkingContext);
