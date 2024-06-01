import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
   container: {
        flex: 1,
        backgroundColor:'white', 
        padding:12
    },
    mainView: {
        marginTop:40,
        flex:1,
    },
    searchFlex:{
        flex:0.1,
        
    },
    suggestArea:{
        flex:0.27,
        marginVertical:5
    },
    suggestText:{
        fontSize:18,
        fontFamily:'OpenSans_600SemiBold',
        marginTop:5
    },
    title:{
        color:"white",
        fontSize:17,
        fontFamily:'OpenSans_600SemiBold',
        
    },
    subTitle:{
        color:"white",
        fontFamily:'LibreFranklin_400Regular'
    },
    recipeDetail:{
        fontSize:18,
        fontFamily:'LibreFranklin_800ExtraBold'
    },
    header:{
        fontSize:15,
        fontFamily:'LibreFranklin_500Medium',
        marginVertical:8
    },
    header:{
        fontSize:15,
        fontFamily:'LibreFranklin_500Medium',
        marginVertical:8
    },
    header1:{
            fontSize:15,
            fontFamily:'LibreFranklin_800ExtraBold',
            marginVertical:8
        },

     ingredientItem: {
        color: 'orange',
        fontSize:16,
},
notFound:{
    textAlign:'center',justifyContent:'center',alignItems:'center', color: 'red', fontSize:18,fontFamily:'OpenSans_600SemiBold',marginTop:5 
},
  text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
       button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 52,
        borderRadius: 20,
        elevation: 3,
        backgroundColor: '#252525',
      },
});
export default styles;