/*
import { View, StyleSheet, FlatList } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'

import MemoListItem from '../../components/MemoListItem'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import LogOutButton from '../../components/LogOutButton'
import { db, auth } from '../../config'
import { type Memo } from '../../../types/memo'

const handlePress = () => {
    router.push('/memo/create')
}

const List = (): JSX.Element => {
    const [memos, setMemos] = useState<Memo[]>([])
    const navigation = useNavigation()
    useEffect(() => {
        navigation.setOptions({
        headerRight: () => {
            return <LogOutButton />
        }
    })
    }, [])
    useEffect(() => {
        if( auth.currentUser === null) { return }
        const ref = collection(db, `user/${auth.currentUser.uid}/memos`)
        const q = query(ref, orderBy('updatedAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const remoteMemos: Memo[] = []
            snapshot.forEach((doc) => {
                console.log('memo', doc.data())
                const { bodyText, updatedAt } = doc.data()
                remoteMemos.push({
                    id: doc.id,
                    bodyText,
                    updatedAt
                })
            })
            setMemos(remoteMemos)
        })
        return unsubscribe
    }, [])
    return(
        <View style={styles.container}>

            <FlatList 
                data={memos}
                renderItem={({ item }) => < MemoListItem memo={item} />}
            />

            <CircleButton onPress={handlePress}>
                <Icon name='plus' size={40} color='#ffffff'/>
            </CircleButton>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    }
})

export default List
*/

import { View, StyleSheet, FlatList, Text } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'

import MemoListItem from '../../components/MemoListItem'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/Icon'
import LogOutButton from '../../components/LogOutButton'
import { db, auth } from '../../config'
import { type Memo } from '../../../types/memo'

const handlePress = () => {
    router.push('/memo/create')
}

// ここがキモ！このコンポーネントをExportするよ！
export default function List(): JSX.Element {
    const [memos, setMemos] = useState<Memo[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const navigation = useNavigation()
    
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return <LogOutButton />
            }
        })
    }, [])
    
    useEffect(() => {
        // ユーザーの状態をチェック
        console.log('Auth state:', auth.currentUser ? 'ログイン中' : 'ログインしてない')
        
        if (auth.currentUser === null) { 
            setError('ユーザーがログインしていません')
            setLoading(false)
            return 
        }
        
        try {
            const ref = collection(db, `users/${auth.currentUser.uid}/memos`)
            const q = query(ref, orderBy('updatedAt', 'desc'))
            
            console.log('Firestore query作成:', ref.path)
            
            const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                console.log('Snapshot received:', snapshot.size, '件のデータ')
                const remoteMemos: Memo[] = []
                snapshot.forEach((doc) => {
                console.log('Document data:', doc.id, doc.data())
                const { bodyText, updatedAt } = doc.data()
                remoteMemos.push({
                    id: doc.id,
                    bodyText,
                    updatedAt
                })
                })
                setMemos(remoteMemos)
                setLoading(false)
            },
            (err) => {
                console.error('Firestore error:', err)
                setError(`データ取得エラー: ${err.message}`)
                setLoading(false)
            }
            )
            
        return unsubscribe
            } catch (err: unknown) {  // ここでerr:unknownって明示的に型を指定！
            console.error('Setup error:', err)
            // TypeGuardでエラー型チェックしてから使うよ〜！
            setError(`セットアップエラー: ${err instanceof Error ? err.message : String(err)}`)
            setLoading(false)
            return () => {}
            }
    }, [])
    
    return(
        <View style={styles.container}>
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            
            {loading ? (
                <View style={styles.centerContainer}>
                    <Text>ロード中...💭</Text>
                </View>
            ) : memos.length === 0 && !error ? (
                <View style={styles.centerContainer}>
                    <Text>メモがありません。右下の+ボタンから作成してみよう！✨</Text>
                </View>
            ) : (
                <FlatList 
                    data={memos}
                    renderItem={({ item }) => <MemoListItem memo={item} />}
                    keyExtractor={(item) => item.id}
                />
            )}

            <CircleButton onPress={handlePress}>
                <Icon name='plus' size={40} color='#ffffff'/>
            </CircleButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#ffeeee',
        margin: 8,
        borderRadius: 8
    },
    errorText: {
        color: '#ff0000'
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    }
})