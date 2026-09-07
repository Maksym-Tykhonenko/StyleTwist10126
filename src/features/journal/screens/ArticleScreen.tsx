import React from 'react';
import {ImageBackground, Pressable, ScrollView, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {articles} from '../../../data/articles';
import {RootStackParamList} from '../../../navigation/types';
import {Button, Reveal, styles as s} from '../../../ui/AppUI';
import {Share} from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Article'>;

export default function ArticleScreen({route, navigation}: Props) {
  const article = articles.find(item => item.id === route.params.id) ?? articles[0];

  return (
    <SafeAreaView edges={['top']} style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Reveal delay={30} distance={20}>
          <ImageBackground source={article.image} style={s.detailHero}>
            <View style={s.articleShade} />
            <Pressable onPress={() => navigation.goBack()} style={s.back}><Text style={s.text}>← Back</Text></Pressable>
          </ImageBackground>
        </Reveal>
        <View style={s.articleBody}>
          <Reveal delay={110} distance={18}>
            <Text style={s.articleLabel}>{article.label} · {article.minutes} MIN READ</Text>
          </Reveal>
          <Reveal delay={170} distance={20}>
            <Text style={s.articleDetailTitle}>{article.title}</Text>
          </Reveal>
          {article.body.split('\n\n').map((paragraph, index) => (
            <Reveal key={index} delay={230 + index * 55} distance={16}>
              <Text style={index === 0 ? s.articleLead : s.articleParagraph}>{paragraph}</Text>
            </Reveal>
          ))}
          <Reveal delay={280 + article.body.split('\n\n').length * 55} distance={16}>
            <View style={s.articleButtons}>
              <View style={s.flex}><Button secondary label="↗ Share" onPress={() => Share.share({message: `${article.title}\n\n${article.body}`})} /></View>
            </View>
          </Reveal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
