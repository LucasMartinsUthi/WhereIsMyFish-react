import React from 'react'
import { Polygon, Circle } from 'react-native-svg'
import { View, Text } from 'react-native'

export default props => {
    const hex = (x, y, size) => {
        const height = size * Math.sqrt(3) / 2 

        let centerX = (x + 1) * size - (size * x / 4 )
        let centerY = x % 2 == 0 ? (y + 1) * height : (y + 1) * height + height

        centerX = x == 0 ? centerX : centerX * 2 - size
        centerY = y == 0 ? centerY : (x % 2 == 0 ? centerY * 2 - height : centerY * 2 - height * 2)
        
        
        const points = [
            // Point 1
            [[centerX - size/2],
            [centerY - height]],

            // Point 2
            [[centerX + size/2],
            [centerY - height]],

            // Point 3
            [[centerX + size],
            [centerY]],

            // Point 4
            [[centerX + size/2],
            [centerY + height]],

            // Point 5
            [[centerX - size/2],
            [centerY + height]],

            // Point 6
            [[centerX - size],
            [centerY]]
        ]
        
        let colorHex = "lime"
        if(props.state.selected)
            colorHex = "blue"
        if(props.state.path)
            colorHex = "red"
        if(!props.state.enable)
            colorHex = "black"

        const colorCircle = props.state.player == 1 ? "red" : "yellow"
        const circle = props.state.player == 0 ? null : <Circle cx={centerX} cy={centerY} r={props.size / 2} fill={colorCircle} onPress={() => props.onPress(props.x, props.y)} />

        return (
            <View>
                <Polygon
                    points={points.join(" ")}
                    fill={colorHex}
                    stroke="purple"
                    strokeWidth="1"
                    onPress={() => props.onPress(props.x, props.y)}
                />
                {circle}
            </View>
        )
    }

    return (
        <View>
            {hex(props.x, props.y, props.size)}
        </View>
    )
} 


    
