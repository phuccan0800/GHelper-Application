import React from 'react';
import { View, Text } from 'react-native';
import i18n from "../translator/i18ln";

function Loading() {
    return (
        <View>
            <Text>{i18n.t("loading")}</Text>
        </View>
    );
}

export default Loading;
