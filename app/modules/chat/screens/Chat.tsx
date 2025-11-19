import React, {useCallback, useEffect, useState} from "react";
import {Button, FlatList, StyleSheet, Text, TextInput, View} from "react-native";
import {getSocket} from "@/app/modules/common/api/socket";
import {useChatMutation} from "@/app/modules/chat/api/hooks";
import {useUser} from "@/app/modules/user/api/hooks";
import uuid from "react-native-uuid";
import {ChatRoomScreenNavigationProp, ChatRoomScreenRouteProp, Message} from "@/app/modules/chat/types";
import {loadMessages, saveMessages} from "@/app/modules/chat/utils/storageApI";
import {upsertChatEntry} from "@/app/modules/chat/utils/processIncomingMessage";

type Props = {
  route: ChatRoomScreenRouteProp;
  navigation: ChatRoomScreenNavigationProp;
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  message: { marginVertical: 2, padding: 8, borderRadius: 8 },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  otherMessage: { alignSelf: "flex-start", backgroundColor: "#ECECEC" },
  inputContainer: { flexDirection: "row", marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 8 },
});

const ChatRoomScreen: React.FC<Props> = ({ route }) => {
  const { contactId } = route.params;
  const user = useUser();
  const userId = user?.data?.id!;
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const { mutate } = useChatMutation();
  const socket = getSocket(userId);

  const initChat = useCallback(async (newChatId: string) => {
    setChatId(newChatId);
    await upsertChatEntry(newChatId, contactId, "");
    const loadedMessages = await loadMessages(newChatId);
    setMessages(loadedMessages);
  }, [contactId]);

  const processChatMessage = useCallback(
    async (msg: Message) => {
      if (!chatId || msg.chatId !== chatId) return;

      setMessages(prev => {
        if (prev.some(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId)) return prev;
        const updated = [...prev, msg];
        saveMessages(`chat_${chatId}`, updated);
        upsertChatEntry(msg.chatId, msg.senderId === userId ? msg.receiverId : msg.senderId, msg.text);
        return updated;
      });
    },
    [chatId, userId]
  );

  useEffect(() => {
    mutate(contactId, {
      onSuccess: data => initChat(data.chatId),
      onError: err => console.error("Chat creation failed", err),
    });
  }, [contactId]);

  useEffect(() => {
    if (!chatId) return;

    if (!socket.connected) socket.connect();
    socket.emit("joinChat", { chatId });

    const handleMessage = (msg: Message) => processChatMessage(msg);
    const handleHistory = ({ chatId: id, messages: history }: { chatId: string; messages: Message[] }) => {
      if (id !== chatId) return;
      history.forEach(processChatMessage);
    };

    socket.on("message", handleMessage);
    socket.on("messageHistory", handleHistory);

    return () => {
      socket.off("message", handleMessage);
      socket.off("messageHistory", handleHistory);
      socket.emit("leaveChat", { chatId });
    };
  }, [chatId, processChatMessage, socket]);

  const sendMessage = useCallback(() => {
    if (!text.trim() || !chatId) return;

    const msg: Message = {
      id: uuid.v4() as string,
      chatId,
      senderId: userId,
      receiverId: contactId,
      text,
      createdAt: new Date().toISOString(),
    };

    socket.emit("sendMessage", msg);
    processChatMessage(msg);
    setText("");
  }, [text, chatId, userId, contactId, socket, processChatMessage]);

  return (
    <View style={styles.container}>
      <FlatList
        inverted
        data={[...messages].reverse()}
        keyExtractor={item => item.id || item.createdAt}
        renderItem={({ item }) => (
          <Text style={[styles.message, item.senderId === userId ? styles.myMessage : styles.otherMessage]}>
            {item.text}
          </Text>
        )}
        initialNumToRender={20}
        removeClippedSubviews
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={text} onChangeText={setText} />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatRoomScreen;
