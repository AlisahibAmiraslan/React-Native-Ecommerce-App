import React, {useRef} from 'react';
import {Animated, View, StyleSheet, FlatList} from 'react-native';
import BannerSlider from '../components/Home/BannerSlider';
import {homeSlider} from '../data/data';
import Pagination from '../components/ProductDetail/Pagination';

const HomeScreen = () => {
  // const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const handleOnScroll = event => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  };

  // const handleOnViewableItemsChanged = useRef(({viewableItems}) => {

  //    setIndex(viewableItems[0]?.index);
  // }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;
  return (
    <View style={styles.container}>
      <FlatList
        data={homeSlider}
        renderItem={({item}) => <BannerSlider item={item} />}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        // onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <Pagination data={homeSlider} scrollX={scrollX} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default HomeScreen;
