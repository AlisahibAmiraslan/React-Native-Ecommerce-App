/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const WİDTH = Dimensions.get('window').width;
const HEİGHT = Dimensions.get('window').height;

const ProductImage = ({images}: {images: any}) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <View>
      <View style={styles.wrap}>
        <FlatList
          data={images}
          renderItem={({item}) => (
            <View>
              <Image
                resizeMode="contain"
                style={styles.wrap}
                source={{uri: item.path}}
              />
            </View>
          )}
          contentContainerStyle={{
            flexDirection: 'row',
          }}
          onMomentumScrollEnd={event => {
            const index = Math.floor(
              Math.floor(event.nativeEvent.contentOffset.x) /
                Math.floor(event.nativeEvent.layoutMeasurement.width),
            );
            setActiveImage(index);
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
        />
        <View style={styles.wrapDot}>
          {images?.map((item: any, index: number) => {
            return (
              <Text
                key={index}
                style={activeImage === index ? styles.dotActive : styles.dot}>
                ⬤
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: WİDTH,
    height: HEİGHT * 0.5,
  },
  wrapDot: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotActive: {
    margin: 3,
    color: 'black',
  },
  dot: {
    margin: 3,
    color: '#888',
  },
});

export default ProductImage;
