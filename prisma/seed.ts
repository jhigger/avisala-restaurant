import {
  PrismaClient,
  type Ingredient,
  type Kingdom,
  type Category,
  type DayOfWeek,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning existing database...");
  await prisma.shift.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItemIngredient.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.menuItem.deleteMany();

  console.log("Seeding pantry ingredients...");
  const ingredients = await Promise.all([
    prisma.ingredient.create({
      data: {
        name: "Cloud Mushrooms",
        kingdom: "LIREO",
        currentStock: 12.5,
        unit: "kg",
        lowStockThreshold: 3.0,
        costPerUnit: 18.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Free-Range Poultry",
        kingdom: "LIREO",
        currentStock: 25.0,
        unit: "kg",
        lowStockThreshold: 5.0,
        costPerUnit: 12.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "White Truffle Essence",
        kingdom: "LIREO",
        currentStock: 4.0,
        unit: "L",
        lowStockThreshold: 1.0,
        costPerUnit: 85.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Hathorian Smoked Pork Ribs",
        kingdom: "HATHORIA",
        currentStock: 30.0,
        unit: "kg",
        lowStockThreshold: 8.0,
        costPerUnit: 15.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Volcanic Chili Peppers",
        kingdom: "HATHORIA",
        currentStock: 8.0,
        unit: "kg",
        lowStockThreshold: 2.0,
        costPerUnit: 9.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Prime Beef Tenderloin",
        kingdom: "HATHORIA",
        currentStock: 18.0,
        unit: "kg",
        lowStockThreshold: 4.0,
        costPerUnit: 28.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Aged Beef Shank",
        kingdom: "SAPIRO",
        currentStock: 22.0,
        unit: "kg",
        lowStockThreshold: 6.0,
        costPerUnit: 20.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Sapiro Golden Potatoes",
        kingdom: "SAPIRO",
        currentStock: 45.0,
        unit: "kg",
        lowStockThreshold: 10.0,
        costPerUnit: 4.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Forest Wild Honey",
        kingdom: "SAPIRO",
        currentStock: 15.0,
        unit: "L",
        lowStockThreshold: 3.0,
        costPerUnit: 14.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Wild Adamyan Salmon",
        kingdom: "ADAMYA",
        currentStock: 16.0,
        unit: "kg",
        lowStockThreshold: 4.0,
        costPerUnit: 32.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Ocean Prawns & Shellfish",
        kingdom: "ADAMYA",
        currentStock: 20.0,
        unit: "kg",
        lowStockThreshold: 5.0,
        costPerUnit: 24.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Butterfly Pea Blossom Nectar",
        kingdom: "ADAMYA",
        currentStock: 9.0,
        unit: "L",
        lowStockThreshold: 2.0,
        costPerUnit: 16.0,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Jasmine Saffron Rice",
        kingdom: "GENERAL",
        currentStock: 50.0,
        unit: "kg",
        lowStockThreshold: 12.0,
        costPerUnit: 3.5,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: "Artisanal Brioche Flour",
        kingdom: "GENERAL",
        currentStock: 35.0,
        unit: "kg",
        lowStockThreshold: 8.0,
        costPerUnit: 2.5,
      },
    }),
  ]);

  const ingMap = new Map<string, string>(
    ingredients.map((i: Ingredient) => [i.name, i.id]),
  );

  console.log("Seeding elemental menu items...");
  const menuItems: Array<{
    name: string;
    description: string;
    price: number;
    kingdom: Kingdom;
    category: Category;
    brilyanteSpiceLevel: number;
    imageUrl: string;
    isChefSpecial: boolean;
    dietary: string;
    ingredients: Array<{ name: string; qty: number }>;
  }> = [
    // LIREO (Air)
    {
      name: "Amihan's Ethereal Cloud Soup",
      description:
        "Delicate broth of silver cloud mushrooms, lemongrass, white truffle vapor, and crispy lotus root crisps.",
      price: 340,
      kingdom: "LIREO",
      category: "Appetizers",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "Vegetarian,Gluten-Free",
      ingredients: [
        { name: "Cloud Mushrooms", qty: 0.25 },
        { name: "White Truffle Essence", qty: 0.05 },
      ],
    },
    {
      name: "Lirean Wind-Kissed Poultry Roast",
      description:
        "Slow-roasted free-range chicken infused with mountain citrus, kaffir lime, and wild thyme, served with herb jus.",
      price: 680,
      kingdom: "LIREO",
      category: "Mains",
      brilyanteSpiceLevel: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Halal,Gluten-Free",
      ingredients: [
        { name: "Free-Range Poultry", qty: 0.8 },
        { name: "Jasmine Saffron Rice", qty: 0.2 },
      ],
    },
    {
      name: "Brilyante ng Hangin Mocktail",
      description:
        "Celestial sparkling elixir infused with blue curaçao syrup, fresh garden mint, cucumber ribbon, and dry ice mist.",
      price: 260,
      kingdom: "LIREO",
      category: "Potions",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Vegetarian,Gluten-Free",
      ingredients: [],
    },
    {
      name: "Sky-High Soufflé of Cassiopeia",
      description:
        "Warm, airy pandan and Madagascar vanilla soufflé dusted with silver powdered sugar and coconut cream.",
      price: 320,
      kingdom: "LIREO",
      category: "Desserts",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "Vegetarian",
      ingredients: [{ name: "Artisanal Brioche Flour", qty: 0.1 }],
    },
    {
      name: "Royal Council of Lireo Feast",
      description:
        "Banquet platter of wind-kissed roast, cloud mushroom dumplings, crystal spring rolls, saffron rice, and breeze tea.",
      price: 2450,
      kingdom: "LIREO",
      category: "Banquets",
      brilyanteSpiceLevel: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "Halal",
      ingredients: [
        { name: "Free-Range Poultry", qty: 1.5 },
        { name: "Cloud Mushrooms", qty: 0.5 },
        { name: "Jasmine Saffron Rice", qty: 0.6 },
      ],
    },

    // HATHORIA (Fire)
    {
      name: "Hagorn's Flaming Volcanic Ribs",
      description:
        "12-hour hickory-smoked pork baby back ribs glazed with fiery habanero lava sauce and flambéed tableside.",
      price: 890,
      kingdom: "HATHORIA",
      category: "Mains",
      brilyanteSpiceLevel: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "",
      ingredients: [
        { name: "Hathorian Smoked Pork Ribs", qty: 0.9 },
        { name: "Volcanic Chili Peppers", qty: 0.15 },
      ],
    },
    {
      name: "Hathorian Fire-Roast Skewers",
      description:
        "Charred prime beef tenderloin tips skewered with blistered peppers and glazed with smoked chipotle honey.",
      price: 490,
      kingdom: "HATHORIA",
      category: "Appetizers",
      brilyanteSpiceLevel: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Halal,Gluten-Free",
      ingredients: [
        { name: "Prime Beef Tenderloin", qty: 0.4 },
        { name: "Volcanic Chili Peppers", qty: 0.1 },
      ],
    },
    {
      name: "Brilyante ng Apoy Potion",
      description:
        "Blood orange nectar, smoked chili agave, pomegranate reduction, garnished with a flaming cinnamon quill.",
      price: 280,
      kingdom: "HATHORIA",
      category: "Potions",
      brilyanteSpiceLevel: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Vegetarian,Gluten-Free",
      ingredients: [{ name: "Volcanic Chili Peppers", qty: 0.05 }],
    },
    {
      name: "Molten Lava Heart Cake of Asval",
      description:
        "Decadent dark chocolate molten cake infused with subtle chili spice, raspberry coulis, and fiery gold dust.",
      price: 360,
      kingdom: "HATHORIA",
      category: "Desserts",
      brilyanteSpiceLevel: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Vegetarian",
      ingredients: [{ name: "Artisanal Brioche Flour", qty: 0.1 }],
    },
    {
      name: "The Hathorian Warlord Feast",
      description:
        "Imperial platter of flaming volcanic ribs, charred beef skewers, spicy grilled sausages, and volcanic dirty rice.",
      price: 2890,
      kingdom: "HATHORIA",
      category: "Banquets",
      brilyanteSpiceLevel: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "",
      ingredients: [
        { name: "Hathorian Smoked Pork Ribs", qty: 1.5 },
        { name: "Prime Beef Tenderloin", qty: 0.6 },
        { name: "Volcanic Chili Peppers", qty: 0.3 },
      ],
    },

    // SAPIRO (Earth)
    {
      name: "Ybarro's Grounded Beef Shank Osso Buco",
      description:
        "Slow-braised marrow beef shank in rich root vegetable demi-glace served over garlic potato purée.",
      price: 820,
      kingdom: "SAPIRO",
      category: "Mains",
      brilyanteSpiceLevel: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "Gluten-Free",
      ingredients: [
        { name: "Aged Beef Shank", qty: 0.8 },
        { name: "Sapiro Golden Potatoes", qty: 0.4 },
      ],
    },
    {
      name: "Sapphire Ore Truffle Potato Gems",
      description:
        "Crisp golden russet potato rounds tossed in rosemary mineral salt, black truffle oil, and roasted garlic dip.",
      price: 360,
      kingdom: "SAPIRO",
      category: "Appetizers",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Vegetarian,Gluten-Free",
      ingredients: [
        { name: "Sapiro Golden Potatoes", qty: 0.5 },
        { name: "White Truffle Essence", qty: 0.05 },
      ],
    },
    {
      name: "Brilyante ng Lupa Tonic",
      description:
        "Roasted barley and ceremonial green matcha, wild forest honey, creamy oat milk, and a dusting of golden turmeric.",
      price: 270,
      kingdom: "SAPIRO",
      category: "Potions",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Vegetarian,Gluten-Free",
      ingredients: [{ name: "Forest Wild Honey", qty: 0.05 }],
    },
    {
      name: "Golden Earth Honeycomb Crisp",
      description:
        "Crunchy native honeycomb brittle on salted dark chocolate ganache with toasted earth grains and pistachio crumble.",
      price: 330,
      kingdom: "SAPIRO",
      category: "Desserts",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Vegetarian",
      ingredients: [{ name: "Forest Wild Honey", qty: 0.1 }],
    },
    {
      name: "Armea's Stately Sapiro Banquet",
      description:
        "Massive feast of braised beef shank, roasted root medley, golden truffle potatoes, sourdough bread, and harvest honey cider.",
      price: 2750,
      kingdom: "SAPIRO",
      category: "Banquets",
      brilyanteSpiceLevel: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "",
      ingredients: [
        { name: "Aged Beef Shank", qty: 1.6 },
        { name: "Sapiro Golden Potatoes", qty: 1.0 },
        { name: "Forest Wild Honey", qty: 0.2 },
      ],
    },

    // ADAMYA (Water)
    {
      name: "Waters of Adamya Crisp Salmon Fillet",
      description:
        "Pan-seared Atlantic salmon fillet with crispy skin, creamy seaweed risotto, asparagus spears, and citrus glaze.",
      price: 790,
      kingdom: "ADAMYA",
      category: "Mains",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "Halal,Gluten-Free",
      ingredients: [
        { name: "Wild Adamyan Salmon", qty: 0.35 },
        { name: "Jasmine Saffron Rice", qty: 0.2 },
      ],
    },
    {
      name: "Imaw's Wisdom Blue Ocean Chowder",
      description:
        "Velvety sea chowder of sweet crab, clams, and flaked cod naturally colored sapphire with butterfly pea petals.",
      price: 380,
      kingdom: "ADAMYA",
      category: "Appetizers",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Gluten-Free",
      ingredients: [
        { name: "Ocean Prawns & Shellfish", qty: 0.3 },
        { name: "Butterfly Pea Blossom Nectar", qty: 0.05 },
      ],
    },
    {
      name: "Brilyante ng Tubig Nectar",
      description:
        "Sparkling butterfly pea blossom infusion, lychee juice, white elderflower cordial, and bursting sea pearls.",
      price: 270,
      kingdom: "ADAMYA",
      category: "Potions",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: false,
      dietary: "Vegetarian,Gluten-Free",
      ingredients: [{ name: "Butterfly Pea Blossom Nectar", qty: 0.1 }],
    },
    {
      name: "Crystal Pearl Raindrop of Adamya",
      description:
        "Crystal clear water droplet jelly cake served on roasted soybean kinako powder with golden brown sugar drizzle.",
      price: 290,
      kingdom: "ADAMYA",
      category: "Desserts",
      brilyanteSpiceLevel: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "Vegetarian,Gluten-Free",
      ingredients: [],
    },
    {
      name: "The Coral Lagoon Seafood Platter",
      description:
        "Spectacular ocean plateau of butter-poached prawns, seared salmon, grilled calamari, blue chowder, and saffron rice.",
      price: 2950,
      kingdom: "ADAMYA",
      category: "Banquets",
      brilyanteSpiceLevel: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
      isChefSpecial: true,
      dietary: "Halal,Gluten-Free",
      ingredients: [
        { name: "Wild Adamyan Salmon", qty: 0.7 },
        { name: "Ocean Prawns & Shellfish", qty: 1.0 },
        { name: "Jasmine Saffron Rice", qty: 0.6 },
      ],
    },
  ];

  for (const item of menuItems) {
    const { ingredients: itemIngs, ...itemData } = item;
    const created = await prisma.menuItem.create({
      data: itemData,
    });

    for (const ing of itemIngs) {
      const ingId = ingMap.get(ing.name);
      if (ingId) {
        await prisma.menuItemIngredient.create({
          data: {
            menuItemId: created.id,
            ingredientId: ingId,
            quantityNeeded: ing.qty,
          },
        });
      }
    }
  }

  console.log("Seeding dining tables across 4 realms...");
  const tables = await Promise.all([
    // Lireo Terrace (Panoramic open air)
    prisma.diningTable.create({
      data: {
        tableNumber: "L-01",
        realm: "LIREO_TERRACE",
        capacity: 2,
        status: "AVAILABLE",
      },
    }),
    prisma.diningTable.create({
      data: {
        tableNumber: "L-02",
        realm: "LIREO_TERRACE",
        capacity: 4,
        status: "OCCUPIED",
      },
    }),
    prisma.diningTable.create({
      data: {
        tableNumber: "L-03",
        realm: "LIREO_TERRACE",
        capacity: 6,
        status: "AVAILABLE",
      },
    }),
    prisma.diningTable.create({
      data: {
        tableNumber: "L-04",
        realm: "LIREO_TERRACE",
        capacity: 8,
        status: "RESERVED",
      },
    }),

    // Hathorian Hearth (Fiery open kitchen view)
    prisma.diningTable.create({
      data: {
        tableNumber: "H-01",
        realm: "HATHORIAN_HEARTH",
        capacity: 2,
        status: "AVAILABLE",
      },
    }),
    prisma.diningTable.create({
      data: {
        tableNumber: "H-02",
        realm: "HATHORIAN_HEARTH",
        capacity: 4,
        status: "AVAILABLE",
      },
    }),
    prisma.diningTable.create({
      data: {
        tableNumber: "H-03",
        realm: "HATHORIAN_HEARTH",
        capacity: 8,
        status: "OCCUPIED",
      },
    }),

    // Sapiro Great Hall (Grand stone tables)
    prisma.diningTable.create({
      data: {
        tableNumber: "S-01",
        realm: "SAPIRO_HALL",
        capacity: 4,
        status: "AVAILABLE",
      },
    }),
    prisma.diningTable.create({
      data: {
        tableNumber: "S-02",
        realm: "SAPIRO_HALL",
        capacity: 8,
        status: "AVAILABLE",
      },
    }),
    prisma.diningTable.create({
      data: {
        tableNumber: "S-03",
        realm: "SAPIRO_HALL",
        capacity: 12,
        status: "RESERVED",
      },
    }),

    // Adamya Lagoon (Waterside intimate booths)
    prisma.diningTable.create({
      data: {
        tableNumber: "A-01",
        realm: "ADAMYA_LAGOON",
        capacity: 2,
        status: "OCCUPIED",
      },
    }),
    prisma.diningTable.create({
      data: {
        tableNumber: "A-02",
        realm: "ADAMYA_LAGOON",
        capacity: 4,
        status: "AVAILABLE",
      },
    }),
    prisma.diningTable.create({
      data: {
        tableNumber: "A-03",
        realm: "ADAMYA_LAGOON",
        capacity: 6,
        status: "AVAILABLE",
      },
    }),
  ]);

  console.log("Seeding staff and shift roster...");
  const staffMembers = await Promise.all([
    prisma.staff.create({
      data: {
        fullName: "Chef Hagorn",
        title: "Executive Master of the Hearth",
        kingdomAffinity: "HATHORIA",
        role: "HEAD_CHEF",
        contact: "+63 917 111 2001",
        avatarUrl:
          "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80",
      },
    }),
    prisma.staff.create({
      data: {
        fullName: "Danaya",
        title: "Master Sous-Chef & Herbalist",
        kingdomAffinity: "SAPIRO",
        role: "SOUS_CHEF",
        contact: "+63 917 222 3002",
        avatarUrl:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=80",
      },
    }),
    prisma.staff.create({
      data: {
        fullName: "Alena",
        title: "Grand Alchemist of Potions",
        kingdomAffinity: "ADAMYA",
        role: "MIXOLOGIST",
        contact: "+63 917 333 4003",
        avatarUrl:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      },
    }),
    prisma.staff.create({
      data: {
        fullName: "Amihan",
        title: "Royal Maître d' & Host",
        kingdomAffinity: "LIREO",
        role: "HOST",
        contact: "+63 917 444 5004",
        avatarUrl:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      },
    }),
    prisma.staff.create({
      data: {
        fullName: "Aquil",
        title: "Captain of Rapid Dispatch",
        kingdomAffinity: "LIREO",
        role: "RIDER",
        contact: "+63 917 555 6005",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      },
    }),
    prisma.staff.create({
      data: {
        fullName: "Ybarro",
        title: "Senior Floor Ambassador",
        kingdomAffinity: "SAPIRO",
        role: "SERVER",
        contact: "+63 917 666 7006",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      },
    }),
  ]);

  // Seed weekly shifts
  const days: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  for (const staff of staffMembers) {
    for (let i = 0; i < 5; i++) {
      const day = days[i % days.length]!;
      let station = "Dining Floor";
      if (staff.role === "HEAD_CHEF" || staff.role === "SOUS_CHEF")
        station = "Kitchen Hearth";
      else if (staff.role === "MIXOLOGIST") station = "Elixir Bar";
      else if (staff.role === "RIDER") station = "Delivery Wing";
      else if (staff.role === "HOST") station = "Reception Desk";

      await prisma.shift.create({
        data: {
          staffId: staff.id,
          dayOfWeek: day,
          startTime: i % 2 === 0 ? "10:00 AM" : "04:00 PM",
          endTime: i % 2 === 0 ? "06:00 PM" : "11:00 PM",
          station,
        },
      });
    }
  }

  console.log("Seeding sample active orders for KDS & tracking...");
  const sampleItems = await prisma.menuItem.findMany({ take: 6 });

  // Order 1: Preparing in Kitchen
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "AVI-1082",
      customerName: "Rehav Raquim",
      customerPhone: "+63 918 555 1234",
      customerEmail: "raquim@encantadia.ph",
      orderType: "DELIVERY",
      status: "PREPARING",
      deliveryAddress: "Penthouse 14, Lireo Sky Tower, Emerald Ave",
      specialInstructions: "Please ring bell and leave by the terrace doorway.",
      paymentMethod: "GCASH",
      paymentStatus: "PAID",
      subtotal: 1570,
      tax: 188.4,
      deliveryFee: 120,
      totalAmount: 1878.4,
      estimatedMinutes: 25,
      items: {
        create: [
          {
            menuItemId: sampleItems[0]!.id,
            quantity: 2,
            unitPrice: sampleItems[0]!.price,
            spiceLevel: 0,
          },
          {
            menuItemId: sampleItems[1]!.id,
            quantity: 1,
            unitPrice: sampleItems[1]!.price,
            spiceLevel: 1,
          },
        ],
      },
    },
  });

  // Order 2: Ready for Pickup
  const order2 = await prisma.order.create({
    data: {
      orderNumber: "AVI-1083",
      customerName: "Hara Pirena",
      customerPhone: "+63 919 444 8888",
      customerEmail: "pirena@hathoria.ph",
      orderType: "PICKUP",
      status: "READY",
      pickupTime: "07:30 PM",
      specialInstructions: "Pack with extra heat seals for flame preservation.",
      paymentMethod: "MAYA",
      paymentStatus: "PAID",
      subtotal: 1380,
      tax: 165.6,
      deliveryFee: 0,
      totalAmount: 1545.6,
      estimatedMinutes: 5,
      items: {
        create: [
          {
            menuItemId: sampleItems[2]!.id,
            quantity: 2,
            unitPrice: sampleItems[2]!.price,
            spiceLevel: 2,
          },
          {
            menuItemId: sampleItems[3]!.id,
            quantity: 1,
            unitPrice: sampleItems[3]!.price,
            spiceLevel: 3,
          },
        ],
      },
    },
  });

  // Order 3: Pending Kitchen Review
  const order3 = await prisma.order.create({
    data: {
      orderNumber: "AVI-1084",
      customerName: "Muyak of the Ivtres",
      customerPhone: "+63 915 777 9999",
      customerEmail: "muyak@ivtre.net",
      orderType: "DELIVERY",
      status: "PENDING",
      deliveryAddress: "Garden Villa 7, Adamya Waterside Sanctuary",
      specialInstructions: "Small portions, extra napkins please.",
      paymentMethod: "GOLD",
      paymentStatus: "PAID",
      subtotal: 940,
      tax: 112.8,
      deliveryFee: 100,
      totalAmount: 1152.8,
      estimatedMinutes: 40,
      items: {
        create: [
          {
            menuItemId: sampleItems[4]!.id,
            quantity: 1,
            unitPrice: sampleItems[4]!.price,
            spiceLevel: 0,
          },
          {
            menuItemId: sampleItems[5]!.id,
            quantity: 1,
            unitPrice: sampleItems[5]!.price,
            spiceLevel: 1,
          },
        ],
      },
    },
  });

  console.log("Seeding sample table reservations...");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.reservation.create({
    data: {
      bookingReference: "RES-7701",
      guestName: "Lady Cassandra of Lireo",
      guestPhone: "+63 917 888 2211",
      guestEmail: "cassandra@lireo.gov",
      reservationDate: tomorrow,
      timeSlot: "07:00 PM",
      partySize: 4,
      realmPreference: "LIREO_TERRACE",
      specialRequests: "Anniversary celebration, terrace view if possible.",
      status: "CONFIRMED",
      tableId: tables[1]!.id,
    },
  });

  await prisma.reservation.create({
    data: {
      bookingReference: "RES-7702",
      guestName: "King Arman of Sapiro",
      guestPhone: "+63 917 999 3322",
      guestEmail: "arman@sapiro.kingdom",
      reservationDate: tomorrow,
      timeSlot: "08:30 PM",
      partySize: 8,
      realmPreference: "SAPIRO_HALL",
      specialRequests: "VIP Banquet setup with wine pairing.",
      status: "CONFIRMED",
      tableId: tables[8]!.id,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
