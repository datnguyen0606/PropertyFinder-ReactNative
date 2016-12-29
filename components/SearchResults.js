'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text
} from 'react-native';

var PropertyView = require('./PropertyView');

class SearchResults extends Component {

  constructor(props) {
    super(props);
    let dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.listings)
    };
  }

  rowPressed(listerURL) {
    var property = this.props.listings.filter(prop => prop.lister_url === listerURL)[0];
    this.props.navigator.push({
      title: "Property",
      component: PropertyView,
      passProps: {property: property},
      tintColor: '#009688'
    });
  }

  _rowInfo(data) {
    let info = `${data.bedroom_number} Bed - ${data.bathroom_number} Bad - ${data.property_type.toUpperCase()}`;
    info += ` - ${data.keywords.split(", ").slice(0, 4).join(" - ")}`;
    return info;
  }

  renderRow(rowData, sectionID, rowID) {
    const price = rowData.price_formatted.split(' ')[0];
    let pw = 'pm';
    if (rowData.price_type == 'fixed') {
      pw = '';
    } else if (rowData.price_type == 'weekly') {
      pw = 'pw';
    }
    const info = this._rowInfo(rowData);

    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData.lister_url)}
          underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: rowData.img_url }} />
            <View  style={styles.textContainer}>
              <Text style={styles.price}>
                {price}{pw}
              </Text>
              <Text style={styles.title}
                numberOfLines={1}>{rowData.title}</Text>
              <Text style={styles.info} numberOfLines={2}>
                {info}
              </Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }
}

const styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009688'
  },
  title: {
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  info: {
    color: '#a1a1a1'
  }
});

module.exports = SearchResults;