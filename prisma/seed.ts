import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thejerseyjournal.news' },
    update: {},
    create: {
      email: 'admin@thejerseyjournal.news',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })

  console.log('Admin user created:', admin.email)

  // Create sample articles
  const articles = [
    {
      title: 'Hudson County Announces New Development Initiative',
      slug: 'hudson-county-development-initiative',
      excerpt: 'Local officials unveiled a comprehensive plan to boost economic growth across the region.',
      content: `Hudson County has announced a significant new development initiative aimed at revitalizing the local economy. 
        The multi-million dollar project will focus on infrastructure improvements, business incentives, and job creation.
        Key areas of focus include downtown revitalization, transportation improvements, and sustainable development practices.
        The initiative is expected to create thousands of jobs over the next five years and attract new businesses to the region.`,
      category: 'news',
      published: true,
      featured: true,
      publishedAt: new Date('2024-01-15'),
      authorId: admin.id,
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    },
    {
      title: 'Jersey City Council Approves Budget for 2024',
      slug: 'jersey-city-council-approves-budget',
      excerpt: 'The city council unanimously approved the $2.5 billion budget for the upcoming fiscal year.',
      content: `The Jersey City Council has approved a comprehensive budget for 2024 that prioritizes education, 
        public safety, and infrastructure. The $2.5 billion budget includes significant investments in schools, 
        police and fire departments, and road repairs. Mayor's office indicated this budget reflects the city's 
        commitment to creating a better future for all residents.`,
      category: 'news',
      published: true,
      publishedAt: new Date('2024-01-10'),
      authorId: admin.id,
      imageUrl: 'https://images.unsplash.com/photo-1590195633066-261b00c2de27?w=800&q=80',
    },
    {
      title: 'Local Hero Saves Family from House Fire',
      slug: 'local-hero-saves-family',
      excerpt: 'A quick-thinking neighbor heroically rescued a family of four from their burning home.',
      content: `In a dramatic rescue on Monday evening, local resident John Smith successfully evacuated 
        a family of four from their burning home in Hoboken. Smith, who lives next door, noticed the fire 
        around 8 PM and immediately alerted the family, helping them safely escape before firefighters arrived. 
        The family expressed their gratitude and credited Smith with saving their lives. "We're just grateful 
        he was there when we needed him most," said the homeowner.`,
      category: 'news',
      published: true,
      publishedAt: new Date('2024-01-08'),
      authorId: admin.id,
      imageUrl: 'https://images.unsplash.com/photo-1614008375890-cb53b6c5f8d5?w=800&q=80',
    },
  ]

  for (const article of articles) {
    const created = await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    })
    console.log(`Article created: ${created.title}`)
  }

  // Create sample newsletter subscriber
  const subscriber = await prisma.newsletterSubscriber.create({
    data: {
      email: 'subscriber@example.com',
      name: 'Sample Subscriber',
    },
  })

  console.log('Newsletter subscriber created:', subscriber.email)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
