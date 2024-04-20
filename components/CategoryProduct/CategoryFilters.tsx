/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  ScrollView,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

const Checkbox = ({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.checkbox, checked && styles.checked]}
      onPress={onPress}>
      <Text>{label}</Text>
      {checked && <Text>✔</Text>}
    </TouchableOpacity>
  );
};

const CategoryFilters = ({
  products,
  navigation,
}: {
  products: any;
  navigation: any;
}) => {
  const router = useRoute();

  const [seasons, setSeasons] = useState<any>([]);
  const [marks, setMarks] = useState<any>([]);
  const [colors, setColors] = useState<any>([]);
  const [size1Name, setSize1Name] = useState<any>([]);
  const [size2Name, setSize2Name] = useState<any>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMarks, setSelectedMarks] = useState<string[]>([]);
  const [selectedSize1Name, setSelectedSize1Name] = useState<string[]>([]);
  const [selectedSize2Name, setSelectedSize2Name] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>(products);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    setFilteredProducts(products);
    extractFilters();
  }, [products, router.name]);

  const extractFilters = () => {
    let uniqueSeasons: any = [
      ...new Set(
        products
          .map((product: any) => product.season)
          .filter((season: any) => season !== null),
      ),
    ];
    let uniqueMarks: any = [
      ...new Set(
        products
          .map((product: any) => product.markName)
          .filter((mark: any) => mark !== null),
      ),
    ];
    let uniqueColors: any = [
      ...new Set(
        products
          .flatMap((product: any) =>
            product.productSizes.map((size: any) => size.color),
          )
          .filter((color: any) => color !== null),
      ),
    ];
    let uniqueSizes: any = [
      ...new Set(
        products
          .flatMap((product: any) =>
            product.productSizes.map((size: any) => size.size1Name),
          )
          .filter((size: any) => size !== null),
      ),
    ];

    let uniqueSizes2: any = [
      ...new Set(
        products
          .flatMap((product: any) =>
            product.productSizes.map((size: any) => size.size2Name),
          )
          .filter((size: any) => size !== null),
      ),
    ];

    setSeasons(uniqueSeasons);
    setMarks(uniqueMarks);
    setColors(uniqueColors);
    setSize1Name(uniqueSizes);
    setSize2Name(uniqueSizes2);
  };

  const onPressHandler = (id: number) => {
    navigation.navigate('ProductDetail', id);
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedSeasons.length > 0) {
      filtered = filtered.filter((product: any) =>
        selectedSeasons.includes(product.season),
      );
    }

    if (selectedMarks.length > 0) {
      filtered = filtered.filter((product: any) =>
        selectedMarks.includes(product.markName),
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((product: any) =>
        product.productSizes.some((size: any) =>
          selectedColors.includes(size.color),
        ),
      );
    }

    if (selectedSize1Name.length > 0) {
      filtered = filtered.filter((product: any) =>
        product.productSizes.some((size: any) =>
          selectedSize1Name.includes(size.size1Name),
        ),
      );
    }

    if (selectedSize2Name.length > 0) {
      filtered = filtered.filter((product: any) =>
        product.productSizes.some((size: any) =>
          selectedSize2Name.includes(size.size2Name),
        ),
      );
    }

    setFilteredProducts(filtered.length > 0 ? filtered : []);
  };

  useEffect(() => {
    filterProducts();
  }, [
    selectedSeasons,
    selectedColors,
    selectedMarks,
    selectedSize1Name,
    selectedSize2Name,
  ]);

  const toggleSeason = (season: string) => {
    const index = selectedSeasons.indexOf(season);
    if (index === -1) {
      setSelectedSeasons([...selectedSeasons, season]);
    } else {
      setSelectedSeasons(selectedSeasons.filter(item => item !== season));
    }
  };

  const toggleColor = (color: string) => {
    const index = selectedColors.indexOf(color);
    if (index === -1) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(selectedColors.filter(item => item !== color));
    }
  };

  const toggleMark = (mark: string) => {
    const index = selectedMarks.indexOf(mark);
    if (index === -1) {
      setSelectedMarks([...selectedMarks, mark]);
    } else {
      setSelectedMarks(selectedMarks.filter(item => item !== mark));
    }
  };

  const toggleSize1Name = (size: string) => {
    const index = selectedSize1Name.indexOf(size);
    if (index === -1) {
      setSelectedSize1Name([...selectedSize1Name, size]);
    } else {
      setSelectedSize1Name(selectedSize1Name.filter(item => item !== size));
    }
  };

  const toggleSize2Name = (size: string) => {
    const index = selectedSize2Name.indexOf(size);
    if (index === -1) {
      setSelectedSize2Name([...selectedSize2Name, size]);
    } else {
      setSelectedSize2Name(selectedSize2Name.filter(item => item !== size));
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.modalOpenButtonText}>Filters</Text>
        </TouchableOpacity>
        <View style={styles.productsCount}>
          <Text style={styles.productsCountTextNumber}>
            {filteredProducts.length}
          </Text>
          <Text style={styles.productsCountText}>Products</Text>
        </View>
        {/* modal filters */}
        <View>
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.overlay} />

            <View>
              <View style={styles.modalHeight}>
                <ScrollView>
                  <View>
                    <View style={styles.filtersContainer}>
                      <View>
                        <Text style={styles.filterTitle}>Seasons</Text>
                        <View style={styles.modalColorCard}>
                          {seasons.map((season: string, index: number) => (
                            <Checkbox
                              key={index}
                              label={season}
                              checked={selectedSeasons.includes(season)}
                              onPress={() => toggleSeason(season)}
                            />
                          ))}
                        </View>
                      </View>
                      <View>
                        <Text style={styles.filterTitle}>Colors</Text>
                        <View style={styles.modalColorCard}>
                          {colors.map((color: string, index: number) => (
                            <Checkbox
                              key={index}
                              label={color}
                              checked={selectedColors.includes(color)}
                              onPress={() => toggleColor(color)}
                            />
                          ))}
                        </View>
                      </View>
                      <View>
                        <Text style={styles.filterTitle}>Mark Name</Text>
                        <View style={styles.modalColorCard}>
                          {marks.map((mark: string, index: number) => (
                            <Checkbox
                              key={index}
                              label={mark}
                              checked={selectedMarks.includes(mark)}
                              onPress={() => toggleMark(mark)}
                            />
                          ))}
                        </View>
                      </View>
                      {size1Name.length !== 0 && (
                        <View>
                          <Text style={styles.filterTitle}>Size</Text>
                          <View style={styles.modalColorCard}>
                            {size1Name.map((size: string, index: number) => (
                              <Checkbox
                                key={index}
                                label={size}
                                checked={selectedSize1Name.includes(size)}
                                onPress={() => toggleSize1Name(size)}
                              />
                            ))}
                          </View>
                        </View>
                      )}
                      {size2Name.length !== 0 && (
                        <View>
                          <Text style={styles.filterTitle}>Size Body</Text>
                          <View style={styles.modalColorCard}>
                            {size2Name.map((size: string, index: number) => (
                              <Checkbox
                                key={index}
                                label={size}
                                checked={selectedSize2Name.includes(size)}
                                onPress={() => toggleSize2Name(size)}
                              />
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={styles.closeButton}>
                <Button
                  title="Close"
                  color="#d63031"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <View style={styles.productsContainer}>
        {filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={({item}) => (
              <View style={styles.productCard}>
                <TouchableOpacity onPress={() => onPressHandler(item.id)}>
                  <Image
                    source={{uri: item.productCatImage}}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.productPrice}>{item.price} $</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
          />
        ) : (
          <View style={styles.noProduct}>
            <Text style={styles.noProductText}>No Products</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
  modalHeight: {height: 500, backgroundColor: '#fff', padding: 20},
  closeButton: {
    width: '100%',
  },
  container: {
    marginTop: 30,
  },
  productsCount: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  productsCountText: {
    color: 'black',
    fontSize: 18,
  },
  productsCountTextNumber: {
    color: 'red',
    fontSize: 18,
    marginRight: 10,
  },
  modalOpenButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'black',
    color: 'white',
    fontSize: 20,
  },
  modalCloseButtonText: {
    marginTop: 20,
  },
  modalColorCard: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  filtersContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  filterTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#8c7ae6',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  checked: {
    backgroundColor: '#aaf0aa',
  },
  productsContainer: {
    marginTop: 20,
  },
  productCard: {width: '50%', margin: 5},
  productImage: {width: '100%', height: 200},
  productName: {
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  productPrice: {
    textAlign: 'center',
    marginBottom: 5,
    color: '#e74c3c',
    fontSize: 12,
  },
  noProduct: {
    paddingLeft: 20,
  },
  noProductText: {
    color: 'red',
    fontSize: 25,
  },
});

export default CategoryFilters;
