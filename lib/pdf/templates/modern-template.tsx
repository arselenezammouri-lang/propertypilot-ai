import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { GeneratePdfRequest, AgencyBrandingData } from '../types';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
    padding: 0,
  },
  header: {
    backgroundColor: '#1E3A5F',
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 700,
  },
  brandTagline: {
    color: '#60A5FA',
    fontSize: 10,
    marginTop: 2,
  },
  heroSection: {
    position: 'relative',
    height: 280,
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
    padding: 25,
    backgroundColor: 'rgba(30, 58, 95, 0.9)',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
  },
  heroPrice: {
    color: '#60A5FA',
    fontSize: 28,
    fontWeight: 700,
  },
  heroAddress: {
    color: '#E0E7FF',
    fontSize: 12,
    marginTop: 6,
  },
  content: {
    padding: 30,
  },
  sectionTitle: {
    color: '#1E3A5F',
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#60A5FA',
    paddingBottom: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  featureItem: {
    width: '33%',
    padding: 10,
    marginBottom: 10,
  },
  featureLabel: {
    color: '#64748B',
    fontSize: 9,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  featureValue: {
    color: '#1E3A5F',
    fontSize: 13,
    fontWeight: 600,
  },
  description: {
    color: '#334155',
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 25,
    textAlign: 'justify',
  },
  aiSection: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#60A5FA',
  },
  aiTitle: {
    color: '#1E3A5F',
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },
  aiText: {
    color: '#334155',
    fontSize: 10,
    lineHeight: 1.6,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
  },
  gridImage: {
    width: '48%',
    height: 120,
    objectFit: 'cover',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E3A5F',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentInfo: {
    flexDirection: 'column',
  },
  agentName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 600,
  },
  agentContact: {
    color: '#E0E7FF',
    fontSize: 10,
    marginTop: 4,
  },
  footerBrand: {
    alignItems: 'flex-end',
  },
  footerLogo: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: 600,
  },
  footerTagline: {
    color: '#94A3B8',
    fontSize: 8,
    marginTop: 2,
  },
});

interface ModernTemplateProps {
  data: GeneratePdfRequest;
  optimizedImages?: string[];
  agencyBranding?: AgencyBrandingData | null;
}

export function ModernTemplate({ data, optimizedImages = [], agencyBranding }: ModernTemplateProps) {
  const images = optimizedImages.length > 0 ? optimizedImages : data.images;
  const heroImage = images[0];
  const galleryImages = images.slice(1, 5);
  
  const primaryColor = agencyBranding?.primary_color || '#1E3A5F';
  const secondaryColor = agencyBranding?.secondary_color || '#60A5FA';
  const brandName = agencyBranding?.agency_name || 'PropertyPilot AI';
  const tagline = agencyBranding ? 'Agenzia Immobiliare' : 'Pilot Your Agency to the Next Level';
  
  const contactName = agencyBranding?.contact_name || data.agentName;
  const contactPhone = agencyBranding?.contact_phone || data.agentPhone;
  const contactEmail = agencyBranding?.contact_email || data.agentEmail;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ ...styles.header, backgroundColor: primaryColor }}>
          <View style={styles.headerBrand}>
            {agencyBranding?.logo_url ? (
              <Image src={agencyBranding.logo_url} style={{ width: 120, height: 40, objectFit: 'contain' }} />
            ) : (
              <Text style={styles.brandText}>{brandName}</Text>
            )}
          </View>
          <Text style={{ ...styles.brandTagline, color: secondaryColor }}>{tagline}</Text>
        </View>

        {heroImage && (
          <View style={styles.heroSection}>
            <Image src={heroImage} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>{data.title}</Text>
              {data.features.price && (
                <Text style={styles.heroPrice}>{data.features.price}</Text>
              )}
              {data.features.address && (
                <Text style={styles.heroAddress}>{data.features.address}</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Caratteristiche</Text>
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
            {data.features.heating && (
              <View style={styles.featureItem}>
                <Text style={styles.featureLabel}>Riscaldamento</Text>
                <Text style={styles.featureValue}>{data.features.heating}</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Descrizione</Text>
          <Text style={styles.description}>{data.description}</Text>

          {data.aiRewrite && (
            <View style={styles.aiSection}>
              <Text style={styles.aiTitle}>✨ Versione AI Ottimizzata</Text>
              <Text style={styles.aiText}>{data.aiRewrite}</Text>
            </View>
          )}

          {galleryImages.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Galleria</Text>
              <View style={styles.imagesGrid}>
                {galleryImages.map((img, index) => (
                  <Image key={index} src={img} style={styles.gridImage} />
                ))}
              </View>
            </>
          )}
        </View>

        <View style={{ ...styles.footer, backgroundColor: primaryColor }}>
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
            <Text style={{ ...styles.footerLogo, color: secondaryColor }}>{brandName}</Text>
            <Text style={styles.footerTagline}>
              {agencyBranding?.website_url || 'support@propertypilotai.com'}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
