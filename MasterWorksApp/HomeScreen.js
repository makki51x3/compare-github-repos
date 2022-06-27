import { StatusBar } from 'expo-status-bar';
import { View, FlatList, Share, SafeAreaView, ImageBackground, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from "react-redux";
import {updateSuggestionsVisible,updateAddToComparison} from "./redux/slices/searchSlice"
import background from './assets/background.png' // relative path to image 
import {fetchRepos} from './components/fetchRepos'
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

export const HomeScreen = ()=>{

  const onOpenWithWebBrowser = (item) => {
    WebBrowser.openBrowserAsync(item.html_url);
  };

  const onShare = async (item) => {
    try {
      const result = await Share.share({
        message:
          ('Github Repo |'+item.full_name+'\n'+ item.html_url )
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // alert(error.message);
    }
  };

  // Get data from the redux store
  const dispatch = useDispatch();

  const suggestionsVisible = useSelector((state) => state.searchReducer.suggestionsVisible);
  const suggestionList = useSelector((state) => state.searchReducer.suggestionList);
  const comparisonList = useSelector((state) => state.searchReducer.comparisonList);

  const renderItem = ({item}) => {
    if(comparisonList.includes(item) ){
      return <></>
    }
    else{
      return(
        <View style={styles.item}>
          <TouchableOpacity 
            onPress={()=>{dispatch(updateAddToComparison(item))}}
          >          
            <Ionicons name="md-add" size={24} color="black"/>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>{onOpenWithWebBrowser(item)}}
          > 
          <Text style={styles.title}>{item.full_name}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} /> 
      <ImageBackground source= {background}  resizeMode="cover" style={styles.backgroundContainer}>
        <View style={styles.appContainer}> 
          <View  style={styles.searchBar}>
            <TouchableOpacity 
              style={{alignSelf:"center"}} 
              onPress={()=>{dispatch(updateSuggestionsVisible(!suggestionsVisible))}} 
            >
              <Ionicons 
                name={suggestionsVisible?"md-chevron-up":"search-sharp"} 
                size={21} 
                color="black" 
              />
            </TouchableOpacity>
            <View style={{flex:1, flexDirection:"column"}}>
              <TextInput 
                onChangeText= {(filter) => {fetchRepos(dispatch,filter,comparisonList);}} 
                placeholder="Search Repositories"
                style={styles.searchInput} 
              />
            </View>
            { !suggestionsVisible && 
              <TouchableOpacity onPress={()=>{dispatch(updateSuggestionsVisible(!suggestionsVisible))}} >
                <Ionicons 
                  name="md-chevron-down" 
                  size={21} 
                  color="black" 
                />
              </TouchableOpacity>
            }
            { suggestionsVisible && 
              <View style={styles.suggestions}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={true}
                  horizontal = {true}
                  data={suggestionList}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}  
                  ListEmptyComponent={ 
                    <View style={styles.item}>
                      <Text style={styles.title}>No Suggestions Available!</Text>
                    </View>
                  }
                /> 
              </View>
            } 
          </View>         
        </View>
      </ImageBackground>    
    </SafeAreaView>  
  );
}
const styles = StyleSheet.create({
  suggestions:{
    alignSelf:"center",
    backgroundColor:'white', 
    padding:5, 
    paddingHorizontal:5,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    width:"70%"
  },
  item: {
    flexDirection:"row",
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 17,
  },
  header:{
    fontsize: 21,
    fontWeight:"bold",
  },
  container:{
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  searchBar:{
    flexDirection:"row", 
    alignSelf:"center",
    marginTop:"1%",
    backgroundColor:'white', 
    padding:5, 
    paddingHorizontal:10,
    borderRadius:20,
    width:"70%"
  },
  appContainer:{
    flex:1,
    width: "100%", 
    backgroundColor:"rgba(0, 0, 0,0.77)",
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  searchInput: {
    flex:1,
    textAlign: 'center',
    fontSize: 14,
    marginHorizontal:3,
  },
});

export default HomeScreen;
