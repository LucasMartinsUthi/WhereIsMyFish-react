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
        tileSize: Dimensions.get('window').width / (this.props.size * 1.7),
        svgWidth: this.setSvgWidth(),
        svgHeight: this.setSvgHeight(),
        board: this.setBoard(),
        players: [{
                name: "Player 1",
                points: 0
            }, {
                name: "Player 2",
                points: 0
            }
        ],
        turn: 1,
        move: false, // Only allow click on path tile
        selectedTitle: {x: null, y: null} //Selected tile before move
    }

    setBoard() {
        const stateBoardInitial = {
            enable: true,
            player: 0,
            selected: false,
            path: false,
            points: 1
        }
        let stateBoard = []

        for (let y = 0; y < this.props.size; y++) {
            for (let x = 0; x < this.props.size; x++) {
                if (x == 0) 
                    stateBoard.push([Object.assign({}, stateBoardInitial)])
                else 
                    stateBoard[y].push(Object.assign({}, stateBoardInitial))
            }
        }

        return stateBoard
    }
    
    setSvgWidth() {
        const tileSize = Dimensions.get('window').width / (this.props.size * 1.7) * 1.5
        return (tileSize * this.props.size) + tileSize / 2
    }

    setSvgHeight() {
        const tileSize = Dimensions.get('window').width / (this.props.size * 1.7)
        const tileHeight = tileSize * Math.sqrt(3)
        return tileHeight * this.props.size + tileHeight / 2
    }

    eventClick = (x, y) => {
        const selectedTile = this.state.board[x][y]

        if(!selectedTile.enable)
            return
        
        if(!this.state.move)
            this.findPath(x, y)
        else {
            if(selectedTile.path)
                this.movePlayer(x, y)
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
                    if(!board[path.x][path.y].enable || board[path.x][path.y].player != 0)
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
        let board = this.state.board
        let selectedTile = this.state.selectedTitle

        // Move Player
        board[x][y].player = this.state.turn
        board[selectedTile.x][selectedTile.y].player = 0

        // Remove Tile
        board[selectedTile.x][selectedTile.y].enable = false
        
        this.setState({ 
            board,
            move: false,
            selectedTitle:{x: null, y: null},
            turn: this.state.turn * -1
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
                    <Text>Player 1: {this.state.players[0].points}</Text>
                    <Text>Player 2: {this.state.players[1].points}</Text>
                </View>
            </View>
        )
    }
}
