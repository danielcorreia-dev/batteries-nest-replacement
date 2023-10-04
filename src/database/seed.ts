import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DiscardType } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  try {
    // Seed data for User model
    const users = [
      {
        name: 'User1',
        email: 'user1@example.com',
        password: await bcrypt.hash('teste123456', 10),
        username: 'username1',
        points: 100,
      },
      {
        name: 'User2',
        email: 'user2@example.com',
        password: await bcrypt.hash('teste123456', 10),
        username: 'username2',
        points: 200,
      },
    ];

    // Seed data for Company model
    const companies = [
      {
        name: 'Company1',
        email: 'company1@example.com',
        password: await bcrypt.hash('teste123456', 10),
        openingHours: '8:00 AM',
        closeHours: '5:00 PM',
        phone: '123-456-7890',
        zip: '12345',
        number: '1',
      },
      {
        name: 'Company2',
        email: 'company2@example.com',
        password: await bcrypt.hash('teste123456', 10),
        openingHours: '9:00 AM',
        closeHours: '6:00 PM',
        phone: '987-654-3210',
        zip: '54321',
        number: '2',
      },
      // Add more companies as needed
    ];

    // Seed data for Benefit model
    const benefits = [
      {
        name: 'Benefit1',
        points: 10,
        companyId: 1, // Replace with the actual company ID
      },
      {
        name: 'Benefit2',
        points: 20,
        companyId: 2, // Replace with the actual company ID
      },
      // Add more benefits as needed
    ];

    // Seed data for Discard model
    const discards = [
      {
        userId: 1, // Replace with the actual user ID
        companyId: 1, // Replace with the actual company ID
        type: DiscardType.BATTERY,
        points: 5,
        date: new Date(),
      },
      {
        userId: 2, // Replace with the actual user ID
        companyId: 2, // Replace with the actual company ID
        type: DiscardType.MEDICINE, // Use a valid value from the DiscardType enum
        points: 3,
        date: new Date(),
      },
      // Add more discards as needed
    ];

    // Seed data for CompanyCategory model
    const companyCategories = [
      {
        name: 'Category1',
      },
      {
        name: 'Category2',
      },
      // Add more company categories as needed
    ];

    // Seed data for Location model
    const locations = [
      {
        latitude: 40.7128,
        longitude: -74.006,
      },
      {
        latitude: 34.0522,
        longitude: -118.2437,
      },
      // Add more locations as needed
    ];

    // Seed data for Achievement model
    const achievements = [
      {
        name: 'Achievement1',
        icon: 'icon1.png',
        description: 'Description for Achievement1',
      },
      {
        name: 'Achievement2',
        icon: 'icon2.png',
        description: 'Description for Achievement2',
      },
      // Add more achievements as needed
    ];

    // Insert seed data into the database
    await Promise.all([
      prisma.user.createMany({ data: users }),
      prisma.company.createMany({ data: companies }),
    ]);

    await Promise.all([
      prisma.benefit.createMany({ data: benefits }),
      prisma.discard.createMany({ data: discards }),
      prisma.companyCategory.createMany({ data: companyCategories }),
      prisma.location.createMany({ data: locations }),
      prisma.achievement.createMany({ data: achievements }),
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
