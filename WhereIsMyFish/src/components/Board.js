import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native'
import Hex from './Hex'
import Svg from 'react-native-svg'

const style = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '100%',
    },
    board: {
        flex: 3,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottom: {
        flex: 1
    },
})

export default class Board extends Component {

    state = {
        tileSize: Dimensions.get('window').width / (this.props.size * 1.8),
        svgWidth: this.setSvgWidth(),
        svgHeight: this.setSvgHeight(),
        board: this.setBoard(),
        players: [{
                name: "Player 1",
                points: 0,
                fishers: 2
            }, {
                name: "Player 2",
                points: 0,
                fishers: 2
            }
        ],
        turn: 0,
        move: false, // Only allow click on path tile
        selectedTitle: {x: null, y: null}, //Selected tile before move
    }

    setBoard() {
        let stateBoardInitial = {
            enable: true,
            player: null,
            selected: false,
            path: false,
            points: 1
        }
        let stateBoard = []

        const tileP1 = [1, 2, 3]
        const tileP2 = [4, 5]
        const tileP3 = [6]

        
        for (let y = 0; y < this.props.size; y++) {
            for (let x = 0; x < this.props.size; x++) {
                let randomNumber = Math.floor(Math.random() * (7 - 1)) + 1

                if (tileP1.includes(randomNumber))
                    stateBoardInitial.points = 1
                if (tileP2.includes(randomNumber))
                    stateBoardInitial.points = 2
                if (tileP3.includes(randomNumber))
                    stateBoardInitial.points = 3

                if (x == 0) 
                    stateBoard.push([Object.assign({}, stateBoardInitial)])
                else 
                    stateBoard[y].push(Object.assign({}, stateBoardInitial))
            }
        }

        return stateBoard
    }
    
    setSvgWidth() {
        const tileSize = Dimensions.get('window').width / (this.props.size * 1.8) * 1.5
        return ((tileSize * this.props.size) + tileSize / 2) + (4 * this.props.size)
    }

    setSvgHeight() {
        const tileSize = Dimensions.get('window').width / (this.props.size * 1.8)
        const tileHeight = tileSize * Math.sqrt(3)
        return (tileHeight * this.props.size + tileHeight / 2) + (4 * this.props.size)
    }

    eventClick = (x, y) => {
        const tile = this.state.board[x][y]
        const state = this.state

        if(!tile.enable)
            return

        if(state.players[state.turn].fishers){
            let players = state.players
            players[state.turn].fishers --

            this.movePlayer(x,y)
            this.setState({ players })

            return
        }
        
        if(!state.move){ 
            if(tile.player == state.turn)
                this.findPath(x, y)
        } else {
            if(tile.path){
                this.movePlayer(x, y)
                return
            }
            
            if(tile.player == state.turn)
                this.findPath(x, y)
        }
    }

    cleanPath() {
        let board = this.state.board
        for (let y = 0; y < this.props.size; y++) {
            for (let x = 0; x < this.props.size; x++) {
                board[x][y].path = false
                board[x][y].selected = false
            }
        }

        this.setState({ board })
    }

    findPath = (x, y) => {
        this.cleanPath()
        let board = this.state.board

        board[x][y].selected = true

        for (let side = 1; side <= 6; side++) {
            let path = {x: x, y: y}

            while (true){
                switch (side) {
                    case 1:
                        path.y += 1
                        break;
                    case 2:
                        path.y += -1
                        break;
                    case 3:
                        path.x += 1
                        path.y += path.x % 2 == 0 ? 0 : -1
                        break;
                    case 4:
                        path.x += 1
                        path.y += path.x % 2 == 0 ? 1 : 0
                        break;
                    case 5:
                        path.x += -1
                        path.y += path.x % 2 == 0 ? 0 : -1
                        break;
                    case 6:
                        path.x += -1
                        path.y += path.x % 2 == 0 ? 1 : 0
                        break;
                }

                try {
                    if(!board[path.x][path.y].enable || board[path.x][path.y].player != null)
                        break
                    board[path.x][path.y].path = true
                } catch {
                    break
                }
            }   
        }

        this.setState({ 
            board,
            move: true,
            selectedTitle:{x, y}
        })
    }

    movePlayer(x, y) {
        this.cleanPath()
        const state = this.state
        let board = state.board
        let selectedTile = state.selectedTitle

        // Get points
        state.players[state.turn].points += board[x][y].points

        // Move Player
        board[x][y].player = state.turn

        if(selectedTile.x != null){
            // Remove Player
            board[selectedTile.x][selectedTile.y].player = null
            // Remove Tile
            board[selectedTile.x][selectedTile.y].enable = false
        }

        let turn = state.turn
        turn ^= 1
        
        this.setState({ 
            board,
            move: false,
            selectedTitle:{x: null, y: null},
            turn
        })
    }

    buildBoard() {
        const w = this.state.tileSize
        let board = []
        
        for (let y = 0; y < this.props.size; y++) {
            for (let x = 0; x < this.props.size; x++) {
                board.push(<Hex onPress={this.eventClick} state={this.state.board[x][y]} x={x} y={y} size={w} key={`${x},${y}`}/>)
            }
        }

        return board
    }

    render() {
        return (
            <View style={style.container}>
                <View style={style.board}>
                    <Svg height={this.state.svgHeight} width={this.state.svgWidth}>
                        {this.buildBoard()}
                    </Svg>
                </View>
                <View style={style.bottom}>
                    <Text>{this.state.players[0].name}: {this.state.players[0].points}</Text>
                    <Text>{this.state.players[1].name}: {this.state.players[1].points}</Text>
                </View>
            </View>
        )
    }
}
