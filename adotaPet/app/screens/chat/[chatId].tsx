import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import AdotaPetBackground from "../../../assets/components/AdotaPetBackground";
import { globalStyles } from "../../../assets/constants/styles";
import { Ip } from "@/assets/constants/config";

interface User { id: number; name: string; img: string | null; }
interface Chat { id: string; userOwner: User; userAdopt: User; }
interface Message { messageId: number; chatId: string; senderId: number; receiverId: number; text: string; timestamp: string; }

const { width } = Dimensions.get("window");
const maxBubbleWidth = width * 0.75;
const POLL_INTERVAL = 3000; // 3s

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { chatId } = (route.params as { chatId: string }) || {};
  const scrollRef = useRef<ScrollView>(null);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newText, setNewText] = useState("");
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true); // Flag para controlar o scroll automático

  // busca chat
  const loadChat = useCallback(async () => {
    const res = await fetch(`http://${Ip}:8080/chat/${chatId}`);
    const js = await res.json();
    if (js.data) setChat(js.data);
  }, [chatId]);

  // busca mensagens
  const loadMessages = useCallback(async () => {
    const res = await fetch(`http://${Ip}:8080/chat/${chatId}/messages`);
    const js = await res.json();
    setMessages(js.data || []);
    setTimeout(() => {
      if (isScrolledToBottom) {
        scrollRef.current?.scrollToEnd({ animated: true });
      }
    }, 100);
  }, [chatId, isScrolledToBottom]);

  // envia texto
  const sendMessage = async () => {
    if (!newText.trim() || userId == null || !chat) return;

    // calcula quem é o “outro” no chat
    const receiverId =
      chat.userOwner.id === userId
        ? chat.userAdopt.id
        : chat.userOwner.id;

    const payload = {
      chat: { id: chat.id },
      userSendId: userId,
      text: newText.trim(),
    };

    try {
      const res = await fetch(
        `http://${Ip}:8080/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        console.error("Erro ao enviar:", await res.text());
        return;
      }
      setNewText("");
      await loadMessages(); // Carrega as novas mensagens
      scrollRef.current?.scrollToEnd({ animated: true }); // Rolagem imediata para o final após o envio
    } catch (err) {
      console.error("Falha no fetch:", err);
    }
  };

  useEffect(() => {
    (async () => {
      // recupera userId
      const stored = await AsyncStorage.getItem("userId");
      if (!stored) {
        navigation.navigate("Login" as never);
        return;
      }
      setUserId(parseInt(stored, 10));
      await loadChat();
      await loadMessages();
      setLoading(false);
    })();
  }, [loadChat, loadMessages]);

  // polling
  useEffect(() => {
    const iv = setInterval(loadMessages, POLL_INTERVAL);
    return () => clearInterval(iv);
  }, [loadMessages]);

  // detecta quando o usuário rolar para o topo
  const handleScroll = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const contentOffset = event.nativeEvent.contentOffset.y;

    // Verifica se o usuário chegou ao final
    if (contentHeight - contentOffset <= scrollRef.current?.contentHeight) {
      setIsScrolledToBottom(true); // O usuário está no final da lista
    } else {
      setIsScrolledToBottom(false); // O usuário rolou para cima
    }

    // Carrega mensagens mais antigas ao atingir o topo
    if (contentOffset === 0) {
      loadMessages();
    }
  };

  if (loading || userId === null) {
    return (
      <AdotaPetBackground>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FFD54F" />
        </View>
      </AdotaPetBackground>
    );
  }

  const other = chat!.userOwner.id === userId ? chat!.userAdopt : chat!.userOwner;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AdotaPetBackground>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{other.name}</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messagesContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {messages.map((msg) => {
            const isMine = msg.senderId === userId;
            return (
              <View
                key={msg.messageId}
                style={[
                  styles.bubble,
                  isMine ? styles.bubbleRight : styles.bubbleLeft,
                ]}
              >
                <Text style={styles.text}>{msg.text}</Text>
                <Text style={styles.time}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            value={newText}
            onChangeText={setNewText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </AdotaPetBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    height: 60,
    backgroundColor: "#FFD54F",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    ...globalStyles.title,
    fontSize: 20,
    color: "#000",
  },
  messagesContainer: { paddingHorizontal: 12, paddingVertical: 8 },
  bubble: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 16,
    maxWidth: maxBubbleWidth,
  },
  bubbleLeft: {
    backgroundColor: "#EEE",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: "#FFD54F",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  text: { fontSize: 16, marginBottom: 4 },
  time: { fontSize: 12, color: "#555", textAlign: "right" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#FFD54F",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: "#FFF",
  },
  sendBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFD54F",
    borderRadius: 20,
  },
  sendText: { color: "#000", fontWeight: "600" },
});
