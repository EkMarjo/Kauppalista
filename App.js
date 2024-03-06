import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, TextInput } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';


export default function App() {
const[product, setProduct] = useState('');
const[amount, setAmount] = useState('');
const[list, setList] = useState([]);

const db = SQLite.openDatabase('coursedb.db');

useEffect(() => {
  db.transaction(tx => {
  tx.executeSql('create table if not exists list (id integer primary key not null, product text, amount text);');
  }, () => console.error("Error when creating DB"), updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
    tx.executeSql('insert into list (product, amount) values (?, ?);',
    [product, amount]);
    }, null, updateList)
    }
    
    const updateList = () => {
      db.transaction(tx => {
      tx.executeSql('select * from list;', [], (_, { rows }) =>
      setList(rows._array)
      );
      }, null, null);
      };

      const deleteItem = (id) => {
        db.transaction(
          tx => {
            tx.executeSql(`delete from list where id = ?;`, [id]);
          }, null, updateList
        )    
      }
        


  return (
    <View style={styles.container}>
      <TextInput
placeholder='Product'
onChangeText={product => setProduct(product)}
value={product}/>
<TextInput
placeholder='Amount'
onChangeText={amount => setAmount(amount)}
value={amount}/>
<Button onPress={saveItem} title="Save" />
<Text style={styles.headerText}>Shopping List</Text>
<FlatList
style={{marginLeft : "5%"}}
keyExtractor={item => item.id.toString()}
renderItem={({item}) =>
<View style={styles.listcontainer}>
<Text>{item.product},{item.amount} </Text>
<Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>Bought</Text>
</View>}
data={list}
/>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
