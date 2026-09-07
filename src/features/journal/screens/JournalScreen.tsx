import React from 'react';
import {ImageBackground, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {articles} from '../../../data/articles';
import {CardReveal, Header, HeroReveal, MotionPressable, Screen, styles as s} from '../../../ui/AppUI';

export default function JournalScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <Header eyebrow="THE STYLE TWIST" title="Journal" />
      {articles.map((article, index) => (
        index === 0 ? (
          <HeroReveal key={article.id} delay={120}>
            <MotionPressable onPress={() => navigation.navigate('Article', {id: article.id})} style={[s.articleCard, s.articleFeatured]} pressScale={0.97}>
              <ImageBackground source={article.image} style={s.articleHero} imageStyle={s.articleImage}>
                <View style={s.articleShade} />
                <View style={s.articleOverlay}>
                  <Text style={s.articleLabel}>FEATURED · {article.minutes} min read</Text>
                  <Text style={s.articleHeroTitle}>{article.title}</Text>
                </View>
              </ImageBackground>
            </MotionPressable>
          </HeroReveal>
        ) : (
          <CardReveal key={article.id} delay={140 + index * 90}>
            <MotionPressable onPress={() => navigation.navigate('Article', {id: article.id})} style={s.articleCard} pressScale={0.965}>
              <ImageBackground source={article.image} style={s.articleThumb} imageStyle={s.articleImage}>
                <View style={s.articleShade} />
                <View style={s.articleOverlay}>
                  <Text style={s.articleLabel}>{article.label} · {article.minutes} min read</Text>
                  <Text style={s.articleTitle}>{article.title}</Text>
                </View>
              </ImageBackground>
            </MotionPressable>
          </CardReveal>
        )
      ))}
    </Screen>
  );
}
