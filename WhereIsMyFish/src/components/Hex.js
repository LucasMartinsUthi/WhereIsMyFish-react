import React from 'react'
import { View, Dimensions } from 'react-native'
import Svg, { Polygon } from 'react-native-svg'

const w = Dimensions.get('window').width / 8

export default props => 
    <Svg height="100" width="100">
        <Polygon
            points="40,5 70,80 25,95"
            fill="lime"
            stroke="purple"
            strokeWidth="1"
        />
    </Svg>
    
