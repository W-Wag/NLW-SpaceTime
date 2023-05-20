import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Switch,
  TextInput,
  Image,
} from 'react-native'
import { Link } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

interface Memory {
  coverUrl: string
  content: string
  id: string
  createdAt: string
}

export default function MemoryID() {
  const { bottom, top } = useSafeAreaInsets()

  const [memories, setMemories] = useState<Memory[]>([])

  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')
  const [cover, setCover] = useState<string | null>(null)

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get(`/memories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(response.data)

    const memoria = memories.map((memory) => {
      return memory.id
    })

    console.log(memoria)
  }

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0]) {
        setCover(result.assets[0].uri)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadMemories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <ScrollView
      className="flex-1 px-6"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>
      <View className="mt-6 space-y-10">
        <View className="space-y-4">
          <View className="mt-6 space-y-6">
            <View className="flex-row items-center gap-2">
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: '#767577', true: '#372560' }}
                thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
              />
              <Text className="font-body text-base text-gray-200">
                Tornar memória pública
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="h-30 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
            onPress={openImagePicker}
          >
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#FFF" />
              <Text className="font-body text-sm text-gray-200">
                Alterar foto ou vídeo de capa
              </Text>
            </View>
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            {cover ? (
              <Image
                source={{
                  uri: cover,
                }}
                className="h-48 w-full rounded-lg object-cover py-8"
                alt=""
              />
            ) : (
              <Image
                source={{
                  uri: 'http://192.168.1.2:3333/uploads/f2e71104-0053-4f64-a9fa-e69f33106fd4.jpg',
                }}
                className="h-48 w-full rounded-lg object-cover py-8"
                alt=""
              />
            )}
          </View>
          <TextInput
            multiline
            value={content}
            onChangeText={(value) => setContent(value)}
            textAlignVertical="top"
            className="my-4 p-0  font-body text-lg text-gray-50"
            placeholderTextColor="#56565a"
            placeholder="Fique livre para editar as fotos, vídeos e relatos sobre essa experiência."
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => console.log(cover, isPublic, content)}
            className="self-end rounded-full bg-green-500 px-5 py-2"
          >
            <Text className="text-center font-alt text-sm uppercase text-black">
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
