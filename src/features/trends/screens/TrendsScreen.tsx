import React from 'react';
import {ImageBackground, Linking, Pressable, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {trendSources, trendStories} from '../../../data/trends';
import {Button, Header, Mentor, Screen, styles as s} from '../../../ui/AppUI';

const years: Array<'2026' | '2027'> = ['2026', '2027'];

export default function TrendsScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <Header eyebrow="TREND REPORT" title="2026 / 2027 Trends" />
      <Mentor text="This is your editorial trend desk: what is strong right now in 2026, and what already looks like it is building for 2027. Use it to style smarter, not just buy more." />

      {years.map(year => {
        const stories = trendStories.filter(item => item.year === year);
        return (
          <View key={year} style={s.trendsYearBlock}>
            <View style={s.trendsYearHeader}>
              <Text style={s.trendsYearTitle}>{year}</Text>
              <Text style={s.body}>
                {year === '2026'
                  ? 'Current runway-to-wardrobe directions we can use now.'
                  : 'Forward-looking signals based on current runway and editorial movement.'}
              </Text>
            </View>

            {stories.map((story, index) => (
              <View key={story.id} style={s.trendCard}>
                <ImageBackground source={story.image} style={s.trendHero} imageStyle={s.articleImage}>
                  <View style={s.articleShade} />
                  <View style={s.trendHeroOverlay}>
                    <Text style={[s.adviceTag, year === '2027' && s.tripTag]}>{story.label}</Text>
                    <Text style={s.trendHeroTitle}>{story.title}</Text>
                  </View>
                </ImageBackground>

                <View style={s.trendCardBody}>
                  <Text style={s.body}>{story.summary}</Text>

                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>Key direction</Text>
                    {story.direction.map(item => (
                      <View key={item} style={s.trendBulletRow}>
                        <Text style={s.trendBullet}>•</Text>
                        <Text style={s.body}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>Trend colors</Text>
                    <View style={s.detailTags}>
                      {story.colors.map(color => (
                        <View key={color} style={s.colorTag}>
                          <Text style={s.detailTagText}>{color}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={s.detailSection}>
                    <Text style={s.cardTitle}>How to translate it into your wardrobe</Text>
                    {story.wardrobeMoves.map(move => (
                      <View key={move} style={s.trendBulletRow}>
                        <Text style={s.trendBullet}>•</Text>
                        <Text style={s.body}>{move}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={[s.tipCard, index % 2 === 1 && s.trendTipAlt]}>
                    <Text style={s.eyebrow}>EDITOR NOTE</Text>
                    <Text style={s.body}>{story.stylingNote}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      })}

      <View style={s.trendSourcesCard}>
        <Text style={s.cardTitle}>Source desk</Text>
        <Text style={s.body}>2026 blocks summarize current coverage. 2027 blocks are directional forecasts inferred from the latest runway/editorial movement.</Text>
        {trendSources.map(source => (
          <Pressable key={source.url} onPress={() => Linking.openURL(source.url)} style={s.trendSourceLink}>
            <Text style={s.goldText}>{source.title} ↗</Text>
          </Pressable>
        ))}
      </View>

      <Button label="Review My Wardrobe Against Trends" onPress={() => navigation.navigate('Wardrobe')} />
    </Screen>
  );
}
