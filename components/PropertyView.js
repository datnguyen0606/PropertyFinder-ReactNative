'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Text,
  Dimensions
} from 'react-native';

class PropertyView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 400,
      height: 300
    };
  }

  componentDidMount() {
    let property = this.props.property;
    const maxWidth = Dimensions.get('window').width;
    const ratio = property.img_height / property.img_width;
    const height = maxWidth * ratio;
    this.setState({width: maxWidth, height: height});
  }

  render() {
    let property = this.props.property;
    let stats = property.bedroom_number + ' bed ' + property.property_type;
    if (property.bathroom_number) {
      stats += ', ' + property.bathroom_number + ' ' + (property.bathroom_number > 1
        ? 'bathrooms' : 'bathroom');
    }

    const price = property.price_formatted.split(' ')[0];
    let pw = 'pm';
    if (property.price_type == 'fixed') {
      pw = '';
    } else if (property.price_type == 'weekly') {
      pw = 'pw';
    }
    return (
      <ScrollView style={styles.container}>
        <Image style={{ width: this.state.width, height: this.state.height }}
          resizeMode="cover"
          source={{uri: property.img_url}} />
        <View style={styles.heading}>
          <Text style={styles.price}>{price}{pw}</Text>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.separator}/>
        </View>
        <Text style={styles.description}>{stats}</Text>
        <Text style={styles.description}>{property.keywords}</Text>
        <Text style={styles.description}>{property.summary}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 5,
    color: '#009688'
  },
  title: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  },
  description: {
    fontSize: 16,
    margin: 5,
    color: '#656565'
  }
});

module.exports = PropertyView;
