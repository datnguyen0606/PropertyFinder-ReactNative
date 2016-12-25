'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image
} from 'react-native';

import {
  ButtonGroup
} from 'react-native-elements';

let assign = require('object-assign');
let SearchResults = require('./SearchResults');

function urlForQueryAndPage(params) {
  let data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    action: 'search_listings',
    page: 1
  };
  data = assign(params, data);

  let querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
};

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: '',
      selectedIndex: 0
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  _handleResponse(response) {
    this.setState({ isLoading: false , message: '' });
    if (response.application_response_code.substr(0, 1) === '1') {
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {listings: response.listings},
        tintColor: '#009688'
      });
    } else {
      this.setState({ message: 'Location not recognized; please try again.'});
    }
  }

  _executeQuery(query) {
    this.setState({ isLoading: true });
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error =>
         this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
       }));
  }

  onSearchPressed() {
    let params = {
      listing_type: (this.state.selectedIndex == 0) ? 'rent': 'buy',
      place_name: this.state.searchString
    };
    let query = urlForQueryAndPage(params);
    this._executeQuery(query);
  }

  onSearchTextChanged(event) {
    this.setState({ searchString: event.nativeEvent.text });
  }

  onLocationPressed() {
    navigator.geolocation.getCurrentPosition(
      location => {
        var search = location.coords.latitude + ',' + location.coords.longitude;
        var search = '51.4487350,-0.0196540,10km';
        // this.setState({ searchString: search });

        let params = {
          listing_type: (this.state.selectedIndex == 0) ? 'rent': 'buy',
          centre_point: search
        };

        var query = urlForQueryAndPage(params);
        console.log(query);
        this._executeQuery(query);
      },
      error => {
        this.setState({
          message: 'There was a problem with obtaining your location: ' + error
        });
      });
  }

  updateIndex(selectedIndex) {
    this.setState({selectedIndex})
  }

  _renderButtonGroup() {
    const buttons = ['Rent', 'Buy'];
    const { selectedIndex } = this.state;
    return (
      <View style={styles.flowRight}>
        <View style={styles.buttonGroupMargin} />
        <ButtonGroup
          onPress={this.updateIndex}
          containerStyle={styles.containerButtonGroup}
          selectedTextStyle={styles.selectedTextStyle}
          textStyle={styles.containerTextStyle}
          selectedIndex={selectedIndex}
          buttons={buttons} />
        <View style={styles.buttonGroupMargin} />
      </View>
    );
  }

  render() {
    let spinner = this.state.isLoading ?
      ( <ActivityIndicator
          size='large'/> ) :
      ( <View/>);


    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to rent or buy!
        </Text>

        {this._renderButtonGroup()}

        <Text style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>


        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            clearButtonMode="always"
            autoCorrect={false}
            autoCapitalize="none"
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='Search via name or postcode'/>
          <TouchableHighlight style={styles.button}
              onPress={this.onSearchPressed.bind(this)}
              underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.flowRight}>
          <TouchableHighlight style={styles.button}
              onPress={this.onLocationPressed.bind(this)}
              underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Location</Text>
          </TouchableHighlight>
        </View>

        <Image source={require('../Resources/house.png')} style={styles.image}/>
        {spinner}

        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 17,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#009688',
    borderColor: '#009688',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    paddingLeft: 10,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#009688',
    borderRadius: 8,
    color: '#009688'
  },
  containerButtonGroup: {
    height: 36,
    borderRadius: 8,
    borderColor: '#009688',
    marginTop: -10,
    marginBottom: 10,
    flex: 2
  },
  buttonGroupMargin: {
    flex: 1
  },
  selectedTextStyle: {
    color: '#009688'
  },
  containerTextStyle: {
    paddingTop: 8
  },
  image: {
    width: 217,
    height: 138
  }
});

module.exports = SearchPage;