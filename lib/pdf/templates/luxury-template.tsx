import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { GeneratePdfRequest, AgencyBrandingData } from '../types';

Font.register({
  family: 'Playfair',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtXK-F2qC0s.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDYZNXK-F2qC0s.woff2', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2', fontWeight: 600 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    backgroundColor: '#0F0A1A',
    padding: 0,
  },
  header: {
    backgroundColor: '#1A1025',
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontFamily: 'Playfair',
    color: '#D4AF37',
    fontSize: 20,
    fontWeight: 700,
  },
  brandTagline: {
    color: '#9333EA',
    fontSize: 10,
    marginTop: 2,
  },
  heroSection: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    backgroundColor: 'rgba(15, 10, 26, 0.95)',
    borderTopWidth: 3,
    borderTopColor: '#D4AF37',
  },
  heroTitle: {
    fontFamily: 'Playfair',
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 10,
  },
  heroPrice: {
    color: '#D4AF37',
    fontSize: 32,
    fontWeight: 700,
  },
  heroAddress: {
    color: '#A78BFA',
    fontSize: 12,
    marginTop: 8,
  },
  exclusiveBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#D4AF37',
    padding: '8 16',
    borderRadius: 4,
  },
  exclusiveText: {
    color: '#0F0A1A',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  content: {
    padding: 30,
    backgroundColor: '#0F0A1A',
  },
  sectionTitle: {
    fontFamily: 'Playfair',
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#9333EA',
    paddingBottom: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
    backgroundColor: '#1A1025',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  featureItem: {
    width: '33%',
    padding: 12,
    marginBottom: 8,
  },
  featureLabel: {
    color: '#A78BFA',
    fontSize: 9,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featureValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 600,
  },
  description: {
    color: '#E0E0E0',
    fontSize: 11,
    lineHeight: 1.7,
    marginBottom: 30,
    textAlign: 'justify',
  },
  aiSection: {
    backgroundColor: '#1A1025',
    padding: 25,
    borderRadius: 8,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  aiTitle: {
    fontFamily: 'Playfair',
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 12,
  },
  aiText: {
    color: '#E0E0E0',
    fontSize: 10,
    lineHeight: 1.7,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  gridImage: {
    width: '48%',
    height: 130,
    objectFit: 'cover',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1025',
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#D4AF37',
  },
  agentInfo: {
    flexDirection: 'column',
  },
  agentName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 600,
  },
  agentContact: {
    color: '#A78BFA',
    fontSize: 10,
    marginTop: 6,
  },
  footerBrand: {
    alignItems: 'flex-end',
  },
  footerLogo: {
    fontFamily: 'Playfair',
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 700,
  },
  footerTagline: {
    color: '#9333EA',
    fontSize: 8,
    marginTop: 4,
  },
  luxuryDivider: {
    width: 60,
    height: 2,
    backgroundColor: '#D4AF37',
    marginVertical: 15,
  },
});

interface LuxuryTemplateProps {
  data: GeneratePdfRequest;
  optimizedImages?: string[];
  agencyBranding?: AgencyBrandingData | null;
}

export function LuxuryTemplate({ data, optimizedImages = [], agencyBranding }: LuxuryTemplateProps) {
  const images = optimizedImages.length > 0 ? optimizedImages : data.images;
  const heroImage = images[0];
  const galleryImages = images.slice(1, 5);
  
  const accentColor = agencyBranding?.accent_color || '#D4AF37';
  const secondaryColor = agencyBranding?.secondary_color || '#9333EA';
  const brandName = agencyBranding?.agency_name || 'PropertyPilot AI';
  const tagline = agencyBranding ? 'Luxury Real Estate' : 'Premium Real Estate AI';
  
  const contactName = agencyBranding?.contact_name || data.agentName;
  const contactPhone = agencyBranding?.contact_phone || data.agentPhone;
  const contactEmail = agencyBranding?.contact_email || data.agentEmail;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ ...styles.header, borderBottomColor: accentColor }}>
          <View style={styles.headerBrand}>
            {agencyBranding?.logo_url ? (
              <Image src={agencyBranding.logo_url} style={{ width: 120, height: 40, objectFit: 'contain' }} />
            ) : (
              <Text style={{ ...styles.brandText, color: accentColor }}>{brandName}</Text>
            )}
          </View>
          <Text style={{ ...styles.brandTagline, color: secondaryColor }}>{tagline}</Text>
        </View>

        {heroImage && (
          <View style={styles.heroSection}>
            <Image src={heroImage} style={styles.heroImage} />
            <View style={styles.exclusiveBadge}>
              <Text style={styles.exclusiveText}>Esclusiva</Text>
            </View>
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>{data.title}</Text>
              {data.features.price && (
                <Text style={styles.heroPrice}>{data.features.price}</Text>
              )}
              {data.features.address && (
                <Text style={styles.heroAddress}>📍 {data.features.address}</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Caratteristiche Premium</Text>
          <View style={styles.featuresGrid}>
            {data.features.surface && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Superficie</Text>
                <Text style={styles.featureValue}>{data.features.surface}</Text>
              </View>
            )}
            {data.features.rooms && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Locali</Text>
                <Text style={styles.featureValue}>{data.features.rooms}</Text>
              </View>
            )}
            {data.features.bathrooms && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Bagni</Text>
                <Text style={styles.featureValue}>{data.features.bathrooms}</Text>
              </View>
            )}
            {data.features.floor && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Piano</Text>
                <Text style={styles.featureValue}>{data.features.floor}</Text>
              </View>
            )}
            {data.features.propertyType && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Tipologia</Text>
                <Text style={styles.featureValue}>{data.features.propertyType}</Text>
              </View>
            )}
            {data.features.status && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Stato</Text>
                <Text style={styles.featureValue}>{data.features.status}</Text>
              </View>
            )}
            {data.features.energyClass && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Classe Energetica</Text>
                <Text style={styles.featureValue}>{data.features.energyClass}</Text>
              </View>
            )}
            {data.features.yearBuilt && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Anno</Text>
                <Text style={styles.featureValue}>{data.features.yearBuilt}</Text>
              </View>
            )}
            {data.features.parking && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Parcheggio</Text>
                <Text style={styles.featureValue}>{data.features.parking}</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>La Proprietà</Text>
          <View style={styles.luxuryDivider} />
          <Text style={styles.description}>{data.description}</Text>

          {data.aiRewrite && (
            <View style={styles.aiSection}>
              <Text style={styles.aiTitle}>✨ Descrizione Premium AI</Text>
              <Text style={styles.aiText}>{data.aiRewrite}</Text>
            </View>
          )}

          {galleryImages.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Galleria Esclusiva</Text>
              <View style={styles.imagesGrid}>
                {galleryImages.map((img, index) => (
                  <Image key={index} src={img} style={styles.gridImage} />
                ))}
              </View>
            </>
          )}
        </View>

        <View style={{ ...styles.footer, borderTopColor: accentColor }}>
          <View style={styles.agentInfo}>
            {contactName && (
              <Text style={styles.agentName}>{contactName}</Text>
            )}
            {(contactPhone || contactEmail) && (
              <Text style={styles.agentContact}>
                {contactPhone}{contactPhone && contactEmail && ' • '}{contactEmail}
              </Text>
            )}
          </View>
          <View style={styles.footerBrand}>
            <Text style={{ ...styles.footerLogo, color: accentColor }}>{brandName}</Text>
            <Text style={{ ...styles.footerTagline, color: secondaryColor }}>
              {agencyBranding?.website_url || 'support@propertypilotai.com'}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
