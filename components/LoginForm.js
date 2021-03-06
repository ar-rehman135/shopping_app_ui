import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { processLogin } from '../redux/actions/loginActionCreator';
import {Loader} from './LoadingComponent';
import {SetValues,SetImage} from './Data';

const mapStateToProps = (state) => {
  return {
    loginDetails: state.login
  };
}

const mapDispatchToProps = (dispatch)=>{
  return {
    processLogin: (username, password) =>
    {
      dispatch(processLogin(username, password));
    }
  }
} 

class LoginForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      username:"",
      password:""
    }
    
  }

  ProcessLoginAsync() {
    let username = this.state.username;
    let password = this.state.password;
    if (!username){
      if(Platform.OS==="android"){
        ToastAndroid.show("User Name Not Found",ToastAndroid.SHORT);
      }else{
        Alert.alert("Invalid Username","User Name Not Found")
      }
    }
    else if (!password){
      if(Platform.OS==="android"){
        ToastAndroid.show("Please Enter Password",ToastAndroid.SHORT);
      }else{
        Alert.alert("Invalid Password","Please Enter Password")
      }
    }
    else{
    this.props.processLogin(username,password);
    }
  }

  componentDidMount(){
    // let username = this.state.username;
    // let password = this.state.password;
    // if(username !== null && username !== null && username != "" && password != "")
    // {
    //   hit = this.props.processLogin(username,password);
    // }
  }

  componentDidUpdate(){
    if(this.props.loginDetails.inProcess !== true && this.props.loginDetails.isLoggedIn === true)
    {
      if(Platform.OS==="android"){
        ToastAndroid.show(this.props.loginDetails.msg, ToastAndroid.SHORT);
      }
      console.log("This is Props after successfull login" , this.props.loginDetails.data);
      SetValues(this.props.loginDetails.data);
      if(this.props.loginDetails.data.image === null){
        SetImage('../assets/logo.png');
      }
      if (this.props.loginDetails.data.image !== null){
        SetImage(this.props.loginDetails.data.image);
      }
      this.props.goToHomeScreen(this.props.loginDetails.data);
    }
    
  }
  
  render() {
    let processingView = <View/>;
    if(this.props.loginDetails.inProcess === true)
    {
      processingView = <Loader msg="Signing In..."/>
    }
    else if(this.props.loginDetails.inProcess !== true && this.props.loginDetails.isLoggedIn === false){
      {Platform.OS==="android" ? ToastAndroid.show(this.props.loginDetails.msg, ToastAndroid.SHORT) : Alert.alert("Message",this.props.loginDetails.msg) }
    }
    return(
      
      <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS==="ios" ? 'padding' :'height'} 
        >
          {processingView} 
          <TextInput style={styles.inputBox}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="User Name"
            placeholderTextColor = "#ffffff"
            selectionColor="#fff"
            onSubmitEditing={()=> this.password.focus()}
            onChangeText={(username)=>{this.setState({username:username})}}
          /> 

           <TextInput style={styles.inputBox}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor = "#ffffff"
              ref={(input) => this.password = input}
              onChangeText={(pass)=>{this.setState({password:pass})}}
          />
          <TouchableOpacity style={styles.forgotButton} onPress={this.props.forgetPasswordPress}>
            <Text style={styles.buttonText}>Forgot Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.ProcessLoginAsync()}}>
              <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.props.signUpPress}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);


const styles = StyleSheet.create({
    progressViewStyle:{
      position:'absolute',
      width : '85%',
      backgroundColor:'#ffffff',
      height: "30%",
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1
    },
    loginPanel:{
      flex:1,
    },
    container:{
      flex:1
    },
    button: {
      width:300,
      backgroundColor:'#1c313a',
      borderRadius: 25,
      marginVertical: 10,
      paddingVertical: 13
    },
    forgotButton: {

    },
    buttonText: {
      fontSize:16,
      fontWeight:'500',
      color:'#ffffff',
      textAlign:'center'
    },
    inputBox: {
      width:300,
      backgroundColor:'rgba(255, 255,255,0.2)',
      borderRadius: 25,
      borderColor: '#d6d7da',
      borderWidth: 0.5,
      paddingHorizontal:16,
      fontSize:18,
      color:'#ffffff',
      marginVertical: 10,
      height:35
    }
});
