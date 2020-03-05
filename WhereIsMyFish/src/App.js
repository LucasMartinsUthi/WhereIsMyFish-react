import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Hex from './components/Hex'
import Board from './components/Board'

const style = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '100%',
    },
    bottom: {
        flex: 1
    }
})

export default class App extends Component {
    render() {
        return (
            <Board size={6}/>
        )
    }
}
