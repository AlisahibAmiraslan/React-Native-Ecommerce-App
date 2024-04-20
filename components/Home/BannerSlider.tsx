import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';

const WİDTH = Dimensions.get('screen').width;
const HEİGHT = Dimensions.get('screen').height;

const BannerSlider = ({item}: {item: any}) => {
  return (
    <View style={styles.container}>
      <Image source={item.img} resizeMode="contain" style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WİDTH,
    height: HEİGHT * 0.5,
    alignItems: 'center',
  },
  image: {
    height: HEİGHT * 0.5,
    width: '100%',
  },
});

export default BannerSlider;
