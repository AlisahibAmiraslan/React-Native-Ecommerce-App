import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import axios from 'axios';
import {API_ENDPOINT} from '@env';
import {useAuth} from '../../context/AuthContext';
import {useIsFocused} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

const MyOrder = () => {
  const {user} = useAuth();

  const isFocused = useIsFocused();

  const router = useRoute();

  const [GetOrders, setGetOrders] = useState<any>([]);
  const [GetTotalOrderPrice, setGetTotalOrderPrice] = useState<number>(0);
  const [GetOrderDate, setGetOrderDate] = useState<string>('');
  const [GetOrderDetails, setGetOrderDetails] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(API_ENDPOINT + '/Order/getOrderByUser?userid=' + user?.id)
      .then(res => {
        setGetOrders(res.data.ordersByUser);
      })
      .catch(err => console.log(err));
  }, [user?.id, isFocused, router?.name]);

  const findOrderId = (id: number) => {
    const getCorrectOrder = GetOrders?.filter((item: any) => item.id === id);

    setGetTotalOrderPrice(getCorrectOrder[0]?.totalPrice);
    setGetOrderDate(getCorrectOrder[0]?.orderDate);

    setGetOrderDetails(getCorrectOrder[0].orderDetails);
    setModalVisible(true);
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {GetOrders.length < 1 && (
            <Text style={styles.text}>No Availably Orders</Text>
          )}
          {GetOrders.length > 0 &&
            GetOrders.map((order: any, index: number) => {
              return (
                <View key={index} style={styles.orderBody}>
                  <TouchableOpacity
                    onPress={() => {
                      findOrderId(order.id);
                    }}>
                    <Text style={styles.textOrder}>
                      Order Code : {order.orderCode}
                    </Text>
                    <Text style={styles.text}>
                      Total Price : {order.totalPrice} $
                    </Text>
                    <Text style={styles.time}>
                      {new Date(order.orderDate).toDateString()}
                    </Text>
                    <Text style={styles.status}>
                      Order Status: {order.orderStatus}
                    </Text>
                    <View style={styles.more}>
                      <Text style={styles.moreText}>Detail </Text>
                      <Text style={styles.moreIcon}>&rarr;</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}

          <View>
            <Modal
              animationType="slide"
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.modalBody}>
                <View style={styles.close}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                    }}>
                    <Text style={styles.closeText}>X</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <ScrollView>
                    <View style={styles.orderDetailCard}>
                      <View style={styles.totalInfoWrapper}>
                        <Text style={styles.totalInfo}>Total İnformations</Text>
                        <Text style={styles.text}>
                          Total Price : {GetTotalOrderPrice} $
                        </Text>
                        <Text style={styles.time}>
                          {new Date(GetOrderDate).toDateString()}
                        </Text>
                      </View>
                      {GetOrderDetails.length > 0 &&
                        GetOrderDetails.map((detail: any, index: number) => {
                          return (
                            <View key={index} style={styles.orderDetailBody}>
                              <View>
                                <Image
                                  source={{uri: detail.productImage}}
                                  style={styles.image}
                                />
                              </View>
                              <View style={styles.orderdetail}>
                                <Text style={styles.detaiText}>
                                  {detail.productName}
                                </Text>
                                <Text style={styles.detaiText}>
                                  {detail.productPrice} $
                                </Text>
                                <Text style={styles.detaiText}>
                                  {detail.productColor}
                                </Text>
                                <Text style={styles.detaiText}>
                                  {detail.productSize1Name}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  orderBody: {
    padding: 15,
    borderWidth: 1,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  textOrder: {
    fontSize: 17,
    color: 'gray',
    paddingBottom: 10,
  },
  text: {
    fontSize: 20,
    color: 'black',
    paddingBottom: 10,
  },
  modalBody: {
    backgroundColor: 'white',
  },
  close: {
    padding: 20,
  },
  closeText: {
    textAlign: 'right',
    fontSize: 30,
    color: 'red',
  },
  time: {
    color: '#ff7675',
    fontSize: 14,
    marginTop: 5,
  },
  more: {
    marginTop: 10,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 18,
    color: 'black',
  },
  moreIcon: {
    fontSize: 35,
    marginBottom: 12,
  },
  orderDetailCard: {
    width: '100%',
    padding: 20,
  },
  orderDetailBody: {
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  totalInfoWrapper: {
    padding: 20,
    borderWidth: 1,
    backgroundColor: '#dfe6e9',
    marginBottom: 20,
  },
  totalInfo: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
    marginBottom: 20,
  },
  image: {
    width: 123,
    height: 130,
  },
  detaiText: {
    fontSize: 18,
    color: 'black',
  },
  orderdetail: {
    marginLeft: 30,
  },
  status: {
    marginTop: 10,
  },
});

export default MyOrder;
