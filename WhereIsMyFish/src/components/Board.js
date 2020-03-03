import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Hex from './Hex'

const style = StyleSheet.create({
    board: {
        flex: 3,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default class Board extends Component {
    state = {

    }

    render() {
        return (
            <View style={style.board}>
                <Hex />
                <Hex />
            </View>
        )
    }
}
