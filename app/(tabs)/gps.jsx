import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import FabApp from '../../components/fabApp'; 

export default function GpsScreen() {
  const [region] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}     
        showsMyLocationButton={true}  
      />

      <FabApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
