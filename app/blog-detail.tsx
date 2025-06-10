import { useLike } from '@/contexts/SaveContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Blog posts with complete data including id and category
const blogPosts = [
  {
    id: 1,
    title: 'The Fashionistas Guide to Style and Sophistication.',
    date: 'Jan 23, 2025',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
    category: 'Fashion'
  },
  {
    id: 2,
    title: 'AI-Powered Fashion: Trends, Tips, and Inspiration.',
    date: 'Mar 25, 2025',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    category: 'Technology'
  },
  {
    id: 3,
    title: 'Fashion Fails & Wins.',
    date: 'Jan 03, 2025',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
    category: 'Fashion'
  },
  {
    id: 4,
    title: 'Embracing Individuality.',
    date: 'Jun 01, 2025',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop',
    category: 'Lifestyle'
  },
  {
    id: 5,
    title: 'Style Sanctuary: A Haven for Fashion Lovers.',
    date: 'Mar 05, 2025',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
    category: 'Fashion'
  },
  {
    id: 6,
    title: 'The Latest Trends, News, and Must-Haves.',
    date: 'Apr 23, 2025',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
    category: 'Trends'
  },
  {
    id: 7,
    title: 'The Fashion Scene: Where Style Meets Culture.',
    date: 'Feb 15, 2025',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=300&fit=crop',
    category: 'Culture'
  },
  {
    id: 8,
    title: 'Gloss & Glam',
    date: 'Feb 17, 2025',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop',
    category: 'Beauty'
  }
];

// Full blog post content data
const blogPostsContent = {
  1: {
    title: 'The Fashionistas Guide to Style and Sophistication.',
    date: 'Jan 23, 2025',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
    content: `Fashion is more than just clothing; it's a form of self-expression, a way to communicate who you are without saying a word. In today's fast-paced world, staying stylish while maintaining sophistication can seem challenging, but with the right approach, it becomes an art form.

The key to sophisticated fashion lies in understanding the fundamentals: quality over quantity, fit over trends, and confidence over conformity. When you invest in well-made pieces that fit you perfectly, you create a foundation for a wardrobe that will serve you for years to come.

Color coordination plays a crucial role in sophisticated styling. Understanding which colors complement your skin tone, hair color, and personal style can transform your entire look. Neutral colors like black, white, navy, and beige form the backbone of a sophisticated wardrobe, while strategic pops of color can add personality and flair.

Accessories are the finishing touches that can elevate any outfit from ordinary to extraordinary. A well-chosen handbag, the right jewelry, or a classic watch can make all the difference. Remember, less is often more when it comes to sophisticated styling.

The art of layering is another essential skill for the modern fashionista. Knowing how to layer different textures, colors, and styles can help you create interesting and dynamic looks while also being practical for changing weather conditions.

Finally, confidence is your best accessory. No matter how perfectly put-together your outfit is, if you don't feel confident wearing it, it won't have the desired impact. Choose pieces that make you feel comfortable and confident, and your sophistication will shine through naturally.`
  },
  2: {
    title: 'AI-Powered Fashion: Trends, Tips, and Inspiration.',
    date: 'Mar 25, 2025',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    content: `Artificial Intelligence is revolutionizing the fashion industry in ways we never imagined. From personalized styling recommendations to sustainable production methods, AI is reshaping how we think about fashion.

One of the most exciting applications of AI in fashion is personalized styling. Machine learning algorithms can analyze your body type, style preferences, and lifestyle to recommend outfits that are perfectly tailored to you. This technology takes the guesswork out of shopping and helps you build a wardrobe that truly reflects your personal style.

AI is also transforming the design process itself. Designers are using AI tools to predict trends, generate new patterns, and even create entirely new designs. This technology allows for faster iteration and more creative exploration than ever before.

Sustainability is another area where AI is making a significant impact. By optimizing production processes and predicting demand more accurately, AI helps reduce waste in the fashion industry. Smart algorithms can also help consumers make more sustainable choices by providing information about the environmental impact of their purchases.

Virtual try-on technology powered by AI is changing the online shopping experience. Customers can now see how clothes will look on them without ever trying them on physically, reducing returns and increasing satisfaction.

The future of fashion is undoubtedly intertwined with AI technology. As these tools become more sophisticated and accessible, we can expect to see even more innovative applications that will continue to transform the industry.

For fashion enthusiasts, embracing AI-powered tools can enhance your style journey, making it more personalized, sustainable, and enjoyable than ever before.`
  },
  3: {
    title: 'Fashion Fails & Wins.',
    date: 'Jan 03, 2025',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
    content: `Fashion is a journey of experimentation, and with experimentation comes both spectacular wins and memorable fails. Learning from both is essential for developing your personal style.

Common fashion fails often stem from following trends blindly without considering whether they suit your body type, lifestyle, or personal aesthetic. The key is to adapt trends to work for you, rather than trying to fit yourself into every new style that emerges.

One of the biggest fashion wins is finding your signature style. This doesn't mean wearing the same thing every day, but rather developing a consistent aesthetic that reflects your personality and makes you feel confident. Your signature style becomes your fashion foundation.

Fit is everything in fashion. Even the most expensive designer piece will look like a fashion fail if it doesn't fit properly. Investing in tailoring can transform an average piece into a fashion win. Understanding your body type and what silhouettes work best for you is crucial.

Color choices can make or break an outfit. Understanding which colors complement your skin tone can turn a potential fashion fail into a definite win. Don't be afraid to experiment, but always consider how colors work with your natural coloring.

Timing and appropriateness are also crucial factors. Wearing the right outfit for the right occasion is a fashion win, while being overdressed or underdressed can quickly become a fashion fail.

The most important lesson from fashion fails and wins is that style is personal. What works for one person may not work for another, and that's perfectly okay. The goal is to learn from your experiences and continue evolving your personal style.

Remember, even fashion icons have had their share of fashion fails. The difference is that they learned from these experiences and used them to refine their style. Embrace the journey, learn from your mistakes, and celebrate your wins.`
  },
  4: {
    title: 'Embracing Individuality.',
    date: 'Jun 01, 2025',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop',
    content: `In a world of fast fashion and trending styles, embracing your individuality through fashion has never been more important. Your personal style should be a reflection of who you are, not a carbon copy of what everyone else is wearing.

Individuality in fashion starts with self-awareness. Understanding your lifestyle, body type, personal preferences, and the image you want to project is the foundation of developing your unique style. Take time to reflect on what makes you feel confident and comfortable.

Don't be afraid to mix and match different styles, eras, and influences. Some of the most memorable and impactful fashion statements come from unexpected combinations. Vintage pieces mixed with modern elements, formal wear paired with casual accessories, or traditional garments styled in contemporary ways can create truly unique looks.

Color is one of the most powerful tools for expressing individuality. While it's helpful to understand color theory and what works with your skin tone, don't let rules limit your creativity. If a particular color makes you feel amazing, find ways to incorporate it into your wardrobe.

Accessories are perfect for adding personal touches to any outfit. Whether it's a family heirloom, a piece of art jewelry, or a quirky bag, accessories can instantly make an outfit more personal and unique.

The key to embracing individuality is confidence. When you wear something that truly represents who you are, it shows. People are drawn to authenticity, and there's nothing more attractive than someone who is comfortable in their own skin.

Remember that developing your individual style is an ongoing process. As you grow and change as a person, your style will evolve too. Embrace this evolution and don't be afraid to experiment and try new things.

Your individual style is your personal brand. It's how you present yourself to the world and how people remember you. Make it count by staying true to yourself and expressing your unique personality through your fashion choices.`
  },
  5: {
    title: 'Style Sanctuary: A Haven for Fashion Lovers.',
    date: 'Mar 05, 2025',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
    content: `Creating a style sanctuary in your home is about more than just organizing your clothes. It's about creating a space that inspires you, reflects your personal aesthetic, and makes getting dressed a joyful experience.

The foundation of any style sanctuary is organization. Your clothes, shoes, and accessories should be easily accessible and visible. When you can see everything you own, you're more likely to create interesting combinations and make use of pieces that might otherwise be forgotten.

Lighting is crucial in a style sanctuary. Natural light is ideal for seeing true colors and how outfits will look in daylight. If natural light isn't available, invest in good quality lighting that mimics daylight as closely as possible.

A full-length mirror is essential for any style sanctuary. Position it in a spot where you have room to move around and see yourself from different angles. Some fashion lovers prefer multiple mirrors to get a complete view of their outfits.

Storage solutions should be both functional and beautiful. Open wardrobes, elegant hangers, and attractive storage boxes can make your clothes feel like a curated collection rather than just stuff in a closet.

Consider creating different zones in your style sanctuary: a dressing area, a storage area, and perhaps a seating area where you can sit and plan outfits or put on shoes. Each zone should serve a specific purpose while contributing to the overall aesthetic.

Personal touches make a style sanctuary truly special. Display favorite pieces like artwork, include fresh flowers, or showcase special accessories. These elements make the space feel personal and inspiring.

Technology can enhance your style sanctuary too. Apps for cataloging your wardrobe, planning outfits, or tracking what you wear can help you make the most of your collection.

Remember that your style sanctuary should evolve with your needs and preferences. Regularly assess what's working and what isn't, and don't be afraid to make changes to keep the space functional and inspiring.`
  },
  6: {
    title: 'The Latest Trends, News, and Must-Haves.',
    date: 'Apr 23, 2025',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
    content: `Staying current with fashion trends while maintaining your personal style is an art form. The key is to selectively incorporate trends that align with your aesthetic and lifestyle, rather than blindly following every new development.

This season's standout trends include oversized blazers, which offer both comfort and sophistication. They can be dressed up for professional settings or down for casual weekend wear. The versatility of this trend makes it a worthy investment for most wardrobes.

Sustainable fashion continues to gain momentum, with more brands focusing on eco-friendly materials and ethical production methods. Consumers are increasingly conscious of their fashion choices' environmental impact, making sustainability a trend that's here to stay.

Bold prints and patterns are making a strong comeback. From geometric designs to floral motifs, prints are being used to make statement pieces that can transform simple outfits into eye-catching ensembles. The key is to balance bold prints with solid colors to avoid overwhelming your look.

Accessories are taking center stage this season. Statement earrings, chunky chains, and structured bags are all must-have items that can instantly update any outfit. These pieces allow you to experiment with trends without committing to a complete wardrobe overhaul.

The return of vintage-inspired pieces continues to influence modern fashion. 90s minimalism, 70s bohemian styles, and 80s power dressing are all being reinterpreted for contemporary wear. This trend allows fashion lovers to explore different eras and find inspiration from the past.

Technology integration in fashion is becoming more prevalent. Smart fabrics, wearable tech, and app-connected accessories are blurring the lines between fashion and technology, creating exciting possibilities for the future of style.

When incorporating trends, remember that the best-dressed individuals are those who adapt trends to suit their personal style rather than being slaves to fashion. Choose trends that enhance your existing wardrobe and make you feel confident and comfortable.`
  },
  7: {
    title: 'The Fashion Scene: Where Style Meets Culture.',
    date: 'Feb 15, 2025',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=300&fit=crop',
    content: `Fashion has always been deeply intertwined with culture, serving as both a reflection of societal values and a catalyst for cultural change. Understanding this relationship can deepen your appreciation for fashion and help you make more meaningful style choices.

Cultural influences in fashion are everywhere. Traditional garments from different cultures have inspired countless modern designs, from the kimono-inspired sleeves in contemporary dresses to African prints in high-fashion collections. This cross-cultural pollination enriches the fashion landscape and creates beautiful fusion styles.

Street style has become a powerful cultural force in fashion. What people wear on the streets of major cities often influences high-fashion runways, creating a democratic approach to style where anyone can be a trendsetter. Social media has amplified this effect, making street style more influential than ever.

Music and fashion have always had a symbiotic relationship. From punk rock's rebellious aesthetic to hip-hop's luxury streetwear, musical movements have consistently shaped fashion trends. Artists use fashion to express their identity and message, influencing millions of fans worldwide.

Regional fashion scenes each have their unique characteristics. Parisian chic, Milan's luxury, Tokyo's avant-garde street style, and New York's urban sophistication all contribute different flavors to the global fashion conversation. Understanding these regional differences can inspire your personal style.

Fashion weeks around the world showcase not just clothing but cultural values and artistic expression. These events are where fashion meets art, where designers present their vision of beauty, functionality, and cultural commentary through clothing.

The democratization of fashion through social media and fast fashion has made style more accessible but has also raised questions about cultural appropriation and the value of traditional craftsmanship. Being mindful of these issues is part of being a responsible fashion consumer.

Fashion's role in social movements cannot be overlooked. From suffragettes wearing white to support women's rights to modern activists using fashion to make political statements, clothing has always been a powerful tool for social expression.

Understanding fashion's cultural context can help you make more informed and respectful style choices while appreciating the rich history and meaning behind the clothes you wear.`
  },
  8: {
    title: 'Gloss & Glam',
    date: 'Feb 17, 2025',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop',
    content: `Glamour in fashion is about creating an aura of sophistication, elegance, and allure. It's not just about expensive clothes or flashy accessories; true glamour comes from understanding how to create impact through thoughtful styling and confident presentation.

The foundation of glamorous style is quality. Investing in well-made pieces with luxurious fabrics and excellent construction creates a base for glamorous looks. Silk, cashmere, fine wool, and quality leather all contribute to an elevated aesthetic that photographs beautifully and feels amazing to wear.

Fit is paramount in glamorous styling. Clothes should skim the body in flattering ways, neither too tight nor too loose. Tailoring can transform even moderately priced pieces into glamorous statement items. The way fabric falls and moves with your body is crucial to achieving that effortless glamour.

Color choices in glamorous fashion tend toward rich, saturated hues or classic neutrals. Deep jewel tones like emerald, sapphire, and ruby create instant drama, while classic black, white, and metallics provide timeless elegance. Understanding which colors enhance your natural coloring is key to glamorous styling.

Accessories play a crucial role in glamorous looks. Statement jewelry, elegant handbags, and sophisticated shoes can elevate simple outfits to glamorous heights. The key is choosing pieces that complement rather than compete with each other and your outfit.

Hair and makeup are integral parts of glamorous styling. Polished hair and well-executed makeup complete the glamorous look. This doesn't mean heavy or overdone; sometimes the most glamorous looks feature subtle, perfectly applied makeup and sleek, simple hairstyles.

Confidence is the ultimate glamour accessory. When you feel good in what you're wearing, it shows in your posture, your smile, and your overall presence. Glamour is as much about attitude as it is about clothing.

Modern glamour has evolved to be more accessible and wearable than the old Hollywood version. Today's glamorous style can be adapted for everyday wear, professional settings, and special occasions. The key is understanding the elements that create glamour and adapting them to your lifestyle and personal style.

Remember that glamour is personal. What makes one person feel glamorous might not work for another. The goal is to find your own version of glamour that makes you feel confident, elegant, and authentically yourself.`
  }
};

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const [liked, setLiked] = useState(false);
  const { likePost, unlikePost, isPostLiked } = useLike();
  
  const postId = parseInt(id as string);
  const post = blogPostsContent[postId as keyof typeof blogPostsContent];

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Post not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.errorBackButton}>
            <Text style={styles.errorBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleLike = async () => {
    const blogPost = blogPosts.find(p => p.id === postId);
    if (!blogPost) return;
    
    if (isPostLiked(blogPost.id)) {
      await unlikePost(blogPost.id);
      setLiked(false);
    } else {
      await likePost({
        id: blogPost.id,
        title: blogPost.title,
        date: blogPost.date,
        image: blogPost.image,
        category: blogPost.category,
        likedAt: new Date().toISOString()
      });
      setLiked(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header - Now scrollable */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blog</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: post.image }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
              <Ionicons 
                name={(() => {
                  const blogPost = blogPosts.find(p => p.id === postId);
                  return blogPost && isPostLiked(blogPost.id) ? "heart" : "heart-outline";
                })()} 
                size={28} 
                color={(() => {
                  const blogPost = blogPosts.find(p => p.id === postId);
                  return blogPost && isPostLiked(blogPost.id) ? "#FF6B35" : "#fff";
                })()} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.date}>{post.date}</Text>
          
          <View style={styles.contentText}>
            {post.content.split('\n\n').map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  likeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    lineHeight: 32,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  contentText: {
    marginTop: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
    textAlign: 'justify',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  errorBackButton: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bottomSpacing: {
    height: 100,
  },
  headerSpacer: {
    flex: 1,
  },
}); 