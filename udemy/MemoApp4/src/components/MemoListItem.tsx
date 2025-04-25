import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Link } from 'expo-router'

import Icon from './Icon'

const MemoListItem = (): JSX.Element => {
    return(
        <Link href='memo/detail' asChild>
            <TouchableOpacity style={styles.memoListItem}>
                <View>
                    <Text style={styles.memoListItemTitle}>買い物リスト</Text>
                    <Text style={styles.memoListItemData}>2025/04/22/11:28</Text>
                </View>
                <TouchableOpacity>
                    <Icon name='delete' size={32} color='#B0B0B0' />
                </TouchableOpacity>
            </TouchableOpacity>
        </Link>
    )            
}

const styles = StyleSheet.create({
    memoListItem: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 19,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.15)'
    },
    memoListItemTitle: {
        fontSize: 16,
        lineHeight: 32
    },
    memoListItemData: {
        fontSize: 12,
        lineHeight: 16,
        color: '#848484'
    }
})

export default MemoListItem