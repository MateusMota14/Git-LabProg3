import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import AdotaPetBackground from "../../../assets/components/AdotaPetBackground";
import { globalStyles } from "../../../assets/constants/styles";
import { Ip } from "@/assets/constants/config";

interface User {
  id: number;
  name: string;
  img: string | null;
}

interface Chat {
  id: string;
  userOwner: User;
  userAdopt: User;
}

const POLL_INTERVAL = 5000; // 5 segundos

const ChatListScreen: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [unread, setUnread] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const fetchChats = useCallback(async (id: number) => {
    try {
      const resp = await fetch(`http://${Ip}:8080/chat/user/${id}`);
      const json = await resp.json();
      setChats(json.data || []);
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  }, []);

  const checkUnread = useCallback(
    async (chatId: string) => {
      const lastReadStr =
        (await AsyncStorage.getItem(`lastRead:${chatId}`)) ||
        "1970-01-01T00:00:00.000Z";
      const lastRead = new Date(lastReadStr);

      const resp = await fetch(
        `http://${Ip}:8080/chat/${chatId}/messages`
      );
      const json = await resp.json();
      const msgs = json.data || [];
      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        const msgDate = new Date(lastMsg.timestamp);
        if (lastMsg.senderId !== userId && msgDate > lastRead) {
          setUnread((u) => ({ ...u, [chatId]: true }));
          return;
        }
      }
      setUnread((u) => ({ ...u, [chatId]: false }));
    },
    [userId]
  );

  // marca como lido e navega
  const handleChatPress = useCallback(
    async (chatId: string) => {
      await AsyncStorage.setItem(
        `lastRead:${chatId}`,
        new Date().toISOString()
      );
      setUnread((u) => ({ ...u, [chatId]: false }));
      router.push(`/screens/chat/${chatId}`);
    },
    [router]
  );

  // montagem inicial: carrega userId e chats
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("userId");
      if (stored) {
        const id = parseInt(stored, 10);
        setUserId(id);
        await fetchChats(id);
      }
      setLoading(false);
    })();
  }, [fetchChats]);

  // polling de chats a cada POLL_INTERVAL
  useEffect(() => {
    if (userId != null) {
      const iv = setInterval(() => fetchChats(userId), POLL_INTERVAL);
      return () => clearInterval(iv);
    }
  }, [userId, fetchChats]);

  // sempre que mudar chats ou userId, recalcula unread
  useEffect(() => {
    if (userId != null) {
      chats.forEach((c) => checkUnread(c.id));
    }
  }, [chats, userId, checkUnread]);

  if (loading) {
    return (
      <AdotaPetBackground>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FFD54F" />
        </View>
      </AdotaPetBackground>
    );
  }

  return (
    <AdotaPetBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
        </View>
        <ScrollView style={styles.list}>
          {chats.map((chat) => {
            const other =
              chat.userOwner.id === userId
                ? chat.userAdopt
                : chat.userOwner;
            return (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatCard}
                onPress={() => handleChatPress(chat.id)}
              >
                <View style={styles.avatarContainer}>
                  <Image
                    source={
                      other.img
                        ? { uri: other.img }
                        : require("../../../assets/images/user_default.png")
                    }
                    style={styles.avatar}
                  />
                  {unread[chat.id] && <View style={styles.unreadDot} />}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{other.name}</Text>
                  <Text style={styles.preview}>Ver mensagens...</Text>
                </View>
                <Text style={styles.time}>⠀</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </AdotaPetBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    height: 60,
    backgroundColor: "#FFD54F",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    ...globalStyles.title,
    color: "#000",
    fontSize: 24,
  },
  list: { flex: 1, paddingHorizontal: 10, marginTop: 10 },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD54F",
  },
  avatarContainer: { position: "relative" },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#EEE" },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "red",
  },
  textContainer: { flex: 1, marginLeft: 12 },
  name: { fontSize: 18, fontWeight: "600" },
  preview: { fontSize: 14, color: "#666", marginTop: 2 },
  time: { fontSize: 12, color: "#999", marginLeft: 8 },
});

export default ChatListScreen;
