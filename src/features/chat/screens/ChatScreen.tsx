import React, {useState} from 'react';
import {Image, Pressable, ScrollView, Share, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {answers, questions} from '../../../data/chat';
import {useStore} from '../../../store';
import {Reveal, styles as s} from '../../../ui/AppUI';

type ChatMessage = {id: string; type: 'user' | 'mentor'; text: string; question?: string};

export default function ChatScreen() {
  const {saveAdvice, saved} = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {id: 'welcome', type: 'mentor', text: 'Welcome. Select a question below and I’ll share practical advice tailored to your style.'},
  ]);
  const [thinking, setThinking] = useState(false);

  const ask = (question: string) => {
    if (thinking) {
      return;
    }
    const variants = answers[question];
    const previous = messages.filter(item => item.question === question).length;
    const response = variants[previous % variants.length];
    setMessages(current => [...current, {id: `q-${Date.now()}`, type: 'user', text: question}]);
    setThinking(true);
    setTimeout(() => {
      setMessages(current => [...current, {id: `a-${Date.now()}`, type: 'mentor', text: response, question}]);
      setThinking(false);
    }, 850);
  };

  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <Reveal delay={40} distance={16}>
        <View style={s.chatHeader}>
          <View style={s.avatar}><Image source={require('../../../assets/ui/MarcoAvatar.png')} style={s.avatarImage} /></View>
          <View style={s.chatIdentity}><Text style={s.cardTitle}>Marco</Text><Text style={s.online}>Online · Fashion Mentor</Text></View>
          <Pressable onPress={() => setMessages([{id: `welcome-${Date.now()}`, type: 'mentor', text: 'Fresh start. What would you like to explore?'}])} style={s.clear}><Text style={s.muted}>Clear</Text></Pressable>
        </View>
      </Reveal>
      <Reveal delay={120} distance={18} style={s.flex}>
        <ScrollView style={s.chatScroll} contentContainerStyle={s.chatMessages}>
          {messages.map((message, index) => (
            <Reveal key={message.id} delay={160 + index * 40} distance={12} style={[s.bubble, message.type === 'user' ? s.userBubble : s.mentorBubble]}>
              <Text style={s.bubbleText}>{message.text}</Text>
              {message.type === 'mentor' && message.question && (
                <View style={s.bubbleActions}>
                  <Pressable onPress={() => saveAdvice(message.question as string, message.text)} style={s.miniAction}><Text style={saved.some(item => item.answer === message.text) ? s.savedText : s.muted}>{saved.some(item => item.answer === message.text) ? '✓ Saved' : '◇ Save'}</Text></Pressable>
                  <Pressable onPress={() => Share.share({message: `${message.question}\n\n${message.text}`})} style={s.miniAction}><Text style={s.muted}>↗ Share</Text></Pressable>
                </View>
              )}
            </Reveal>
          ))}
          {thinking && <View style={[s.bubble, s.mentorBubble]}><Text style={s.loadingDots}>•  •  •</Text></View>}
        </ScrollView>
      </Reveal>
      <Reveal delay={180} distance={20}>
        <View style={s.questionPanel}>
          <Text style={s.inputLabel}>ASK MARCO A QUESTION</Text>
          <ScrollView style={s.questionScroll} showsVerticalScrollIndicator={false}>
            {questions.map((question, index) => (
              <Reveal key={question} delay={220 + index * 35} distance={10}>
                <Pressable disabled={thinking} onPress={() => ask(question)} style={s.question}>
                  <Text style={s.questionText}>{question}</Text>
                </Pressable>
              </Reveal>
            ))}
          </ScrollView>
        </View>
      </Reveal>
    </SafeAreaView>
  );
}
