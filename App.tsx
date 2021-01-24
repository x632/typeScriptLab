import { BaseRouter, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { StatusBar } from 'expo-status-bar';
import React,{ useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Image,TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();


export default function App() {
  return (
  
   <NavigationContainer>
    <Stack.Navigator initialRouteName="Catalog"> 
      <Stack.Screen name="Catalog" component={Home} 
      options={{title: 'Catalog',
      headerStyle: {backgroundColor: '#e5f0ea'} 
      }}/>
      <Stack.Screen name="IndividualProduct" component={IndividualProduct}
      options={({ route }) => ({ title: route.params.title,
        headerStyle: {backgroundColor: '#e5f0ea'} 
      })}
      />
    
    </Stack.Navigator>
  </NavigationContainer> 
  );
}

const IndividualProduct = ({route}) => {
const {id,title} = route.params;
  const [object, setObject] = useState<Item | null>(null);
  console.log('Rubriken är: ',title);
  console.log('Id:t är: ',id)
  
  useEffect(() => {console.log(`har detta förts över : https://fakestoreapi.com/products/${id}`)
    fetch(`https://fakestoreapi.com/products/${id}`
    )
      .then((response) => response.json())
      .then((json) => {
        console.log('json results:', json);
         setObject(json);
      }  );  
  }, []);
console.log('bilden är:' , object?.image)
    return (
      <View style = {{flex: 1}} >
        <View style = {{ paddingTop: 40, alignItems:'center' }}> 
          <Image
            style={{width: 200, height: 200, resizeMode : 'stretch', margin: 15 }}
            source={{uri: object?.image}} 
          /> 
          <Text style={{fontWeight: 'bold',fontSize: 18, margin: 10}}>{object?.title}</Text>
        </View>
        <View style = {{alignItems: 'flex-start', margin: 10}}>
         <Text style ={{color: 'green',fontWeight: 'bold',fontSize: 17}}>${object?.price}</Text>
         <Text style ={{color: 'black',fontWeight: 'bold',fontSize: 14, marginTop: 10}}>Description</Text>
         <Text style ={{color: 'black',fontWeight: 'normal',fontSize: 14}}>{object?.description}</Text>
         <Text style ={{color: 'gray',fontSize: 14, marginTop: 13}}>Category {object?.category}</Text>
        </View>
        <View style = {{paddingTop: 40, alignItems:'center'}}>
          <Button title = 'Add to cart' onPress={() => console.log('Pressed')}/>
        </View>
      </View>
  );
}



const ItemComponent = ({id, title, category, price, image } : Item) => {
  const navigation = useNavigation();
  
  
  return (
    <TouchableHighlight onPress={() => navigation.navigate('IndividualProduct', {id,title})}>   
        <View style = {styles.post}>
         <View style={{width: 100, height: 100, backgroundColor: 'powderblue', marginRight: 25}}>
          <Image
            style={{width: 100, height: 100, resizeMode : 'stretch' }}
            source={{uri: image}} 
          /> 
          </View>
          <View style = {{width:180, height:100, flexDirection: 'column', justifyContent: 'space-around'}}>
            <Text style= {{ textAlign: 'left', fontWeight: 'bold', fontSize: 15}}>{title}</Text>
            <Text style= {{ textAlign: 'left', fontWeight: 'bold', fontSize: 15, color: 'green'}}>${price}</Text>
          </View>
       </View>
      </TouchableHighlight>
    )
}

interface Item
{
  category: string;
  description?: string
  id: number;
  image: string;
  price: number;
  title: string;

}
const Home = () => {

  const [data, setData] = useState<Item[]>([]); 
  useEffect(() => {
    fetch('https://fakestoreapi.com/products'
    )
      .then((response) => response.json())
      .then((json) => {
        console.log('json results:', json);
        let dataResults:Item[]=[];
        json.forEach((item:Item) => {
          let result = { category: item.category, title: item.title, id: item.id, price: item.price, image: item.image };
          dataResults.push(result);
        });
         setData(dataResults);
       
      }  );  
  }, []);
  
  return (
    <View style={styles.container}>
      
      <FlatList
        data={data}
        renderItem={({ item }) => <ItemComponent 
        id = {item.id} 
        title = {item.title} 
        category = {item.category} 
        price = {item.price} 
        image = {item.image} 
        />}
        
        ItemSeparatorComponent={() => {
            return (
               <View
                 style={{ height: 1, width: '100%', backgroundColor: 'lightgray' }}
               ></View>
             );
         }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    backgroundColor: '#e5f0ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  post: {
    flex: 1.0,
    padding:20,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
});



