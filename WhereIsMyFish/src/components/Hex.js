import React from 'react'
import { Polygon, Circle, ClipPath, Image, Defs } from 'react-native-svg'
import { View } from 'react-native'

export default props => {
    const hex = (x, y, size) => {
        const height = size * Math.sqrt(3) / 2 

        let centerX = (x + 1) * size - (size * x / 4 )
        let centerY = x % 2 == 0 ? (y + 1) * height : (y + 1) * height + height

        centerX = x == 0 ? centerX : centerX * 2 - size
        centerY = y == 0 ? centerY : (x % 2 == 0 ? centerY * 2 - height - 1 : centerY * 2 - height * 2)
        
        centerX = centerX + (4 * x) //Stroke space
        centerY = centerY + (4 * y) //Stroke space
        
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
        
        let imageOpacity = "1"
        let strokeColor = "purple"
        if(props.state.selected)
            strokeColor = "blue"
        if(props.state.path) 
            strokeColor = "lime"
        if(!props.state.enable)
            imageOpacity = "0"

        const colorCircle = props.state.player == 0 ? "red" : "yellow"
        const circle = props.state.player == null ? 
            null : 
            <Circle 
                cx={centerX} 
                cy={centerY} 
                r={props.size / 2.5} 
                fill={colorCircle} 
                onPress={() => props.onPress(props.x, props.y)} 
                stroke = "black"
                strokeWidth = "2"
            />

        const images = [
            require(`../img/tilep1.png`),
            require(`../img/tilep2.png`),
            require(`../img/tilep3.png`)
        ]
        const image = images[props.state.points - 1]
        const sizeImage = size * 2
        return (
            <View>
                <Defs>
                    <ClipPath id={`${props.x},${props.y}`}>
                        <Polygon
                            points={points.join(" ")}
                        />
                    </ClipPath>
                </Defs>
                <Polygon
                    points={points.join(" ")}
                    stroke={strokeColor}
                    strokeWidth="4"
                />
                <Image
                    width={sizeImage}
                    height={sizeImage}
                    x={centerX - (sizeImage / 2)}
                    y={centerY - (sizeImage / 2)}
                    preserveAspectRatio="xMidYMid slice"
                    href={image}
                    clipPath={`url(#${props.x},${props.y})`}
                    onPress={() => props.onPress(props.x, props.y)}
                    opacity={imageOpacity}
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