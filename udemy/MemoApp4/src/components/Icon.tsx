import { createIconSetFromIcoMoon } from '@expo/vector-icons'
import { useFonts } from 'expo-font'

import fontData from '../../assets/fonts/icomoon.ttf'
import fontSelection from '../../assets/fonts/selection.json'

const CustomIcon = createIconSetFromIcoMoon(
    fontSelection,
    'IcoMoon',
    'icomoon.ttf'
)

/*const Icon = (): JSX.Element | null => {*/
interface IconProps {
    name: string
    size: number
    color: string
}

const Icon = (props: IconProps): JSX.Element | null => {
    const [fontLoaded] = useFonts({
        'IcoMoon': fontData
    })
    if (!fontLoaded) {
        return null
    }
    return (
        /*<CustomIcon name='plus' size={40} color='red' />*/
        <CustomIcon {...props} />
    )
}

export default Icon

/*
interface IconProps {
    name: string
    size: number
    color: string
}

const Icon = (props: IconProps): JSX.Element | null => {




<CustomIcon {...props} />
*/

