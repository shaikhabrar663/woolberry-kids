export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      images: { orderBy: { sortOrder: 'asc' } }
    }
  });

  const baseUrl = 'https://www.woolberrykids.com';

  const xmlItems = products.flatMap((product) =>
    product.variants.map((variant) => `
      <item>
        <g:id>${variant.sku}</g:id>
        <g:item_group_id>${product.id}</g:item_group_id>
        <title><![CDATA[${product.name} - ${variant.ageGroup}]]></title>
        <description><![CDATA[${product.description}]]></description>
        <link>${baseUrl}/products/${product.slug}?sku=${variant.sku}</link>
        <g:image_link>${product.images[0] ? (product.images[0].url.startsWith('http') ? product.images[0].url : baseUrl + product.images[0].url) : ''}</g:image_link>
        <g:availability>${variant.inventory > 0 ? 'in_stock' : 'out_of_stock'}</g:availability>
        <g:price>${product.mrp} INR</g:price>
        <g:sale_price>${product.basePrice} INR</g:sale_price>
        <g:brand>Woolberry Kids</g:brand>
        <g:condition>new</g:condition>
        <g:google_product_category>Apparel &amp; Accessories &gt; Clothing &gt; Baby &amp; Toddler Clothing</g:google_product_category>
        <g:age_group>infant</g:age_group>
        <g:gender>unisex</g:gender>
        <g:size>${variant.ageGroup}</g:size>
        <g:color>${variant.colorName}</g:color>
        <g:shipping>
          <g:country>IN</g:country>
          <g:service>Standard</g:service>
          <g:price>0.00 INR</g:price>
        </g:shipping>
      </item>`)
  ).join('');

  const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Woolberry Kids Product Inventory Feed</title>
    <link>${baseUrl}</link>
    <description>Live automated merchant feed for Google Shopping India</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xmlFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}