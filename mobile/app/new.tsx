import {
  Switch,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { api } from '../src/lib/api'
import * as SecureStore from 'expo-secure-store'

export default function NewMemories() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  const [cover, setCover] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')

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

  async function handleCreateMemory() {
    try {
      const token = await SecureStore.getItemAsync('token')

      let coverUrl = ''

      if (cover) {
        const uploadFormData = new FormData()

        uploadFormData.append('file', {
          uri: cover,
          name: 'image.jpg',
          type: 'image/jpg',
        } as any)

        const uploadResponse = await api.post('/upload', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        coverUrl = uploadResponse.data.fileUrl

        await api.post(
          '/memories',
          {
            content,
            isPublic,
            coverUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      }
    } catch (err) {
      console.log(err)
    }

    router.push('/memories')
  }

  return (
    <ScrollView
      className="flex-1 px-8"
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
        onPress={openImagePicker}
        className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
      >
        {cover ? (
          <Image
            source={{ uri: cover }}
            className="h-full w-full rounded-lg object-cover"
            alt=""
          />
        ) : (
          <View className="flex-row items-center gap-2">
            <Icon name="image" color="#FFF" />
            <Text className="font-body text-sm text-gray-200">
              Adicionar foto ou vídeo de capa
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        multiline
        value={content}
        onChangeText={(value) => setContent(value)}
        textAlignVertical="top"
        className="p-0 py-5 font-body text-lg text-gray-50"
        placeholderTextColor="#56565a"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
      />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleCreateMemory}
        className="self-end rounded-full bg-green-500 px-5 py-2"
      >
        <Text className="text-center font-alt text-sm uppercase text-black">
          Salvar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
