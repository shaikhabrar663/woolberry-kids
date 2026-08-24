import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Newborn (0-3 Months)',
        slug: 'newborn',
        isAgeCategory: true,
        minAgeMonths: 0,
        maxAgeMonths: 3,
        h1: 'Ultra-Soft Woollen Essentials for Newborns',
        seoTitle: 'Newborn Winter Clothes (0-3M) | Woolberry Kids',
        seoDescription: 'Gentle, skin-safe winter sets, caps, and booties designed specifically for newborn warmth.'
      }
    }),
    prisma.category.create({
      data: {
        name: '6-12 Months',
        slug: '6-12-months',
        isAgeCategory: true,
        minAgeMonths: 6,
        maxAgeMonths: 12,
        h1: 'Cozy Winter Layers for Active Crawlers (6-12M)',
        seoTitle: 'Baby Winter Clothes 6 to 12 Months | Woolberry Kids',
        seoDescription: 'Breathable knitted sweaters, cardigans, and bottoms designed for flexible 6-12 month babies.'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Baby Sweaters',
        slug: 'baby-sweaters',
        isAgeCategory: false,
        h1: 'Handcrafted Merino & Woollen Sweaters for Babies',
        seoTitle: 'Premium Baby Woollen Sweaters Online | Woolberry Kids',
        seoDescription: 'Shop itch-free, luxuriously soft baby sweaters for newborns up to 5 years.'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Winter Gift Sets',
        slug: 'winter-gift-sets',
        isAgeCategory: false,
        h1: 'Curated Winter Welcome Gift Boxes for Little Ones',
        seoTitle: 'Baby Winter Gift Boxes & Newborn Hampers | Woolberry Kids',
        seoDescription: 'Thoughtful, premium winterwear gift sets packed in keepsake boxes for baby showers and welcomes.'
      }
    })
  ]);

  const p1 = await prisma.product.create({
    data: {
      name: 'Cozy Cloud Merino Woollen Sweater',
      slug: 'cozy-cloud-merino-woollen-sweater',
      description: 'Knitted with ultra-fine, zero-itch merino wool blends to keep your baby warm without overheating.',
      materialDetails: '80% Extra-fine Merino Wool, 20% Organic Combed Cotton.',
      careInstructions: 'Gentle hand wash in cold water with liquid wool detergent. Dry flat in shade.',
      basePrice: 1299.00,
      mrp: 1799.00,
      discountPercent: 28,
      isFeatured: true,
      isBestseller: true,
      seoTitle: 'Cozy Cloud Merino Baby Woollen Sweater | Woolberry Kids',
      seoDescription: 'Soft, breathable baby woollen sweater crafted from premium itch-free merino blend.',
      images: {
        create: [
          { url: '/images/products/merino-sweater-cream-front.webp', altText: 'Cream merino woollen baby sweater front view', sortOrder: 0 },
          { url: '/images/products/merino-sweater-cream-lifestyle.webp', altText: 'Baby crawling wearing cream woollen sweater', sortOrder: 1 },
          { url: '/images/products/merino-sweater-cream-flatlay.webp', altText: 'Merino wool textured stitch detail', sortOrder: 2 }
        ]
      },
      categories: {
        create: [
          { categoryId: categories[1].id },
          { categoryId: categories[2].id }
        ]
      },
      variants: {
        create: [
          { sku: 'WB-CCMS-CRM-03M', ageGroup: '0-3M', colorName: 'Warm Cream', colorHex: '#FDFBF7', inventory: 15 },
          { sku: 'WB-CCMS-CRM-36M', ageGroup: '3-6M', colorName: 'Warm Cream', colorHex: '#FDFBF7', inventory: 22 },
          { sku: 'WB-CCMS-CRM-612M', ageGroup: '6-12M', colorName: 'Warm Cream', colorHex: '#FDFBF7', inventory: 35 },
          { sku: 'WB-CCMS-CRM-12Y', ageGroup: '1-2Y', colorName: 'Warm Cream', colorHex: '#FDFBF7', inventory: 18 },
          { sku: 'WB-CCMS-CRM-23Y', ageGroup: '2-3Y', colorName: 'Warm Cream', colorHex: '#FDFBF7', inventory: 12 },
          { sku: 'WB-CCMS-CRM-35Y', ageGroup: '3-5Y', colorName: 'Warm Cream', colorHex: '#FDFBF7', inventory: 8 }
        ]
      },
      reviews: {
        create: [
          {
            rating: 5,
            title: 'Incredibly soft, zero scratches',
            comment: 'I was skeptical about wool on my 7-month-old, but this sweater is softer than cashmere. Kept him warm during our trip to Himachal.',
            purchasedSize: '6-12M',
            childAgeMonths: 7,
            isApproved: true
          }
        ]
      }
    }
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'Heirloom Pointelle Knitted Cardigan',
      slug: 'heirloom-pointelle-knitted-cardigan',
      description: 'Vintage-inspired wooden button cardigan with intricate breathable pointelle knit detailing.',
      materialDetails: '100% Breathable Soft Acrylic-Wool Blend with natural coconut buttons.',
      careInstructions: 'Machine wash delicate cold in a mesh wash bag. Lay flat to dry.',
      basePrice: 1499.00,
      mrp: 1999.00,
      discountPercent: 25,
      isFeatured: true,
      seoTitle: 'Heirloom Pointelle Baby Knitted Cardigan | Woolberry Kids',
      seoDescription: 'Handcrafted vintage pointelle cardigan with real coconut buttons for babies and toddlers.',
      images: {
        create: [
          { url: '/images/products/pointelle-cardigan-sage.webp', altText: 'Dusty sage pointelle knitted cardigan front view', sortOrder: 0 },
          { url: '/images/products/pointelle-cardigan-buttons.webp', altText: 'Detail of coconut buttons on baby knitwear', sortOrder: 1 }
        ]
      },
      categories: {
        create: [
          { categoryId: categories[1].id },
          { categoryId: categories[2].id }
        ]
      },
      variants: {
        create: [
          { sku: 'WB-HPKC-SAG-612M', ageGroup: '6-12M', colorName: 'Soft Sage', colorHex: '#B2C2B2', inventory: 14 },
          { sku: 'WB-HPKC-SAG-12Y', ageGroup: '1-2Y', colorName: 'Soft Sage', colorHex: '#B2C2B2', inventory: 20 },
          { sku: 'WB-HPKC-SAG-23Y', ageGroup: '2-3Y', colorName: 'Soft Sage', colorHex: '#B2C2B2', inventory: 9 }
        ]
      }
    }
  });

  console.log(`Database seeded successfully with Products: ${p1.name}, ${p2.name}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());